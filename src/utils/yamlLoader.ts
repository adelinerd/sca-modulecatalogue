import yaml from 'js-yaml';
import { getCached, setCached, clearCache } from './cache';

// Expose clearCache globally for debugging
if (typeof window !== 'undefined') {
  (window as typeof window & { clearYamlCache: typeof clearCache }).clearYamlCache = clearCache;
}

/**
 * Wraps a GitLab URL (blob or raw) with the proxy server to bypass CORS.
 */
export function wrapWithProxy(url: string): string {
  try {
    // Skip if already proxied
    if (url.includes('/api/yaml?url=')) {
      console.log(`URL already proxied, skipping: ${url}`);
      return url;
    }

    const u = new URL(url);

    // Check if it's a GitLab URL (needs proxy for CORS)
    if (u.hostname.includes('gitlab')) {
      const proxyUrl = import.meta.env.VITE_YAML_PROXY_SERVER || 'http://localhost:8080/api/yaml';
      console.log(`Wrapping GitLab URL with proxy: ${url}`);
      return `${proxyUrl}?url=${encodeURIComponent(url)}`;
    }

    // GitHub raw URLs don't need proxy (no CORS issues)
    // Local URLs don't need proxy
    return url;
  } catch (err) {
    console.error('Invalid URL:', (err as Error).message);
    return url;
  }
}

/**
 * Converts a GitHub or GitLab blob URL into its raw file URL (without proxying).
 */
export function convertBlobToRaw(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);

    // Skip if already raw
    if (url.includes('/-/raw/') || url.includes('/raw/')) {
      console.log(`URL already raw, skipping conversion: ${url}`);
      return url;
    }

    // GitHub (e.g., github.com/user/repo/blob/branch/path/file.yml)
    if (u.hostname === 'github.com') {
      const [user, repo, blob, branch, ...path] = parts;
      if (blob !== 'blob') throw new Error('Invalid GitHub blob URL');
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path.join('/')}`;
    }

    // GitLab (self-hosted or gitlab.com) - just convert blob to raw, don't proxy yet
    if (u.hostname.includes('gitlab') && url.includes('/blob/')) {
      const blobIndex = parts.indexOf('blob');
      if (blobIndex === -1) return url;

      let endIndex = blobIndex;
      if (blobIndex > 0 && parts[blobIndex - 1] === '-') {
        endIndex = blobIndex - 1;
      }

      const groupAndProject = parts.slice(0, endIndex).join('/');
      const branch = parts[blobIndex + 1];
      const path = parts.slice(blobIndex + 2).join('/');

      return `${u.origin}/${groupAndProject}/-/raw/${branch}/${path}`;
    }

    // If not a blob URL or unsupported, return as-is
    return url;
  } catch (err) {
    console.error('Invalid URL:', (err as Error).message);
    return url;
  }
}

/**
 * Converts a blob URL to raw and wraps with proxy if needed (for GitLab).
 * This is the main function to use for all YAML URL processing.
 */
export function toRawURL(url: string): string {
  // Skip if already proxied
  if (url.includes('/api/yaml?url=')) {
    return url;
  }

  // First convert blob to raw (if needed)
  const rawUrl = convertBlobToRaw(url);

  // Then wrap with proxy (if needed)
  return wrapWithProxy(rawUrl);
}

/**
 * Fetches and parses a YAML file from a GitHub/GitLab URL with caching.
 */
export async function fetchYaml<T>(url: string): Promise<T | null> {
  const rawUrl = toRawURL(url);

  // Check cache
  const cached = getCached<T>(rawUrl);
  if (cached) {
    console.log(`Using cached YAML for: ${rawUrl}`);
    return cached;
  }

  // Fetch and parse
  try {
    console.log(`Fetching YAML from: ${rawUrl}`);
    const res = await fetch(rawUrl);
    console.log(`Response status: ${res.status}, Content-Type: ${res.headers.get('content-type')}`);

    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

    const text = await res.text();
    console.log(`Response text preview (first 200 chars): ${text.substring(0, 200)}`);

    // Check if response is HTML instead of YAML
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('Received HTML instead of YAML - blob URL not converted properly');
    }

    const parsed = yaml.load(text) as T;

    setCached(rawUrl, parsed);
    return parsed;
  } catch (err) {
    console.error(`Failed to fetch or parse YAML from ${rawUrl}:`, err);
    return null;
  }
}