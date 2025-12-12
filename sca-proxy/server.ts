// server.ts
import "dotenv/config";
import express from "express";
import { fetch } from "undici";
import cors from "cors";
import helmet from "helmet";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { z } from "zod";

const app = express();
app.use(helmet());

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, methods: ["GET"] }));

// Key -> { base, token }
const REGISTRY: Record<string, { base: string; token?: string }> = {
  opencode: {
    base: process.env.GITLAB_OPEN_CODE!,      // e.g. "https://gitlab.opencode.de"
    token: process.env.GITLAB_OPEN_CODE_TOKEN,     // PRIVATE-TOKEN (optional if public)
  },
  oss: {
    base: process.env.GITLAB_OSS_BASE!,       // e.g. "https://gitlab.com"
    token: process.env.GITLAB_OSS_TOKEN,      // personal/deploy token
  },

  hub: {
    base: process.env.GITLAB_HUB_BASE!,       // e.g. "https://github.com"
    token: process.env.GITLAB_HUB_TOKEN,      // personal/deploy token
  }
};

const limiter = new RateLimiterMemory({ points: 60, duration: 60 });
app.use(async (req, res, next) => {
  try { await limiter.consume(req.ip || "unknown"); next(); }
  catch { res.status(429).json({ error: "Too many requests" }); }
});

const Query = z.object({
  key: z.string().min(1),                                     // registry key (e.g. "opencode", "oss", "hub")
  project: z.string().min(1),                                 // "group/subgroup/project"
  file: z.string().regex(/^[a-zA-Z0-9/_\-.]+\.ya?ml$/),       // restrict files to YAML
  ref: z.string().default("main"),
});

const UrlQuery = z.object({
  url: z.string().url(),                                      // full GitLab blob URL
});

// Convert GitLab blob URL to raw URL (or return as-is if already raw)
function toRawURL(url: string): { rawUrl: string; token?: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);

    // GitLab (self-hosted or gitlab.com)
    if (u.hostname.includes('gitlab')) {
      const blobIndex = parts.indexOf('blob');

      // If already raw, return as-is
      if (blobIndex === -1) {
        console.log(`URL already raw or not a blob URL: ${url}`);
        const entry = Object.values(REGISTRY).find(e => u.origin === e.base);
        return { rawUrl: url, token: entry?.token };
      }

      // Convert blob to raw
      // GitLab uses /-/blob/ format, so we need to exclude the '-' before 'blob'
      let endIndex = blobIndex;
      if (blobIndex > 0 && parts[blobIndex - 1] === '-') {
        endIndex = blobIndex - 1;
      }

      const groupAndProject = parts.slice(0, endIndex).join('/');
      const branch = parts[blobIndex + 1];
      const path = parts.slice(blobIndex + 2).join('/');

      const rawUrl = `${u.origin}/${groupAndProject}/-/raw/${branch}/${path}`;
      
      // Find matching registry entry for token
      const entry = Object.values(REGISTRY).find(e => u.origin === e.base);

      return { rawUrl, token: entry?.token };
    }

    return null;
  } catch {
    return null;
  }
}

// Endpoint 1: Accept Git blob URL directly
app.get("/api/yaml", async (req, res) => {
  console.log("Endpoint 1 received request:", req.query);
  const parsed = UrlQuery.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query: 'url' parameter required" });
  }

  const { url } = parsed.data;
  const converted = toRawURL(url);
  console.log("Converted URL:", converted);

  if (!converted) {
    console.log("Invalid or unsupported URL:", url);
    return res.status(400).json({ error: "Invalid or unsupported URL" });
  }

  try {
    const upstream = await fetch(converted.rawUrl, {
      headers: {
        ...(converted.token ? { "PRIVATE-TOKEN": converted.token } : {}),
        ...(req.headers["if-none-match"] ? { "If-None-Match": req.headers["if-none-match"] as string } : {}),
      },
    });

    if (upstream.status === 304) return res.status(304).end();
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => upstream.statusText);
      console.log("Status Text", text);
      return res.status(upstream.status).json({ error: `GitLab: ${text}` });
    }

    res.setHeader("Content-Type", "text/yaml; charset=utf-8");
    const etag = upstream.headers.get("etag");
    if (etag) res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    res.send(await upstream.text());
  } catch {
    res.status(502).json({ error: "Upstream fetch failed" });
  }
});

app.listen(process.env.PORT || 8080, () => console.log("Proxy running"));

