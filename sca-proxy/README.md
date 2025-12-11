# SCA Proxy

A secure GitLab YAML proxy server with rate limiting, CORS protection, and caching support.

## Features

- Proxy GitLab repository YAML files through a secure API endpoint
- Support for multiple GitLab instances (corporate and public)
- Rate limiting (60 requests per minute per IP)
- Security headers via Helmet
- CORS protection
- ETag-based caching
- Request validation with Zod

## Prerequisites

- Node.js >= 18
- npm or yarn

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:
```env
# CORS Configuration
CORS_ALLOWED_ORIGINS=https://localhost:5173

# Server Configuration
PORT=8080

# GitLab Instances
GITLAB_OPEN_CODE=https://gitlab.opencode.de
GITLAB_OPEN_CODE_TOKEN=your-private-token-here
GITLAB_OSS_BASE=https://gitlab.com
GITLAB_OSS_TOKEN=your-personal-access-token-here
GITLAB_HUB_BASE=https://github.com
GITLAB_HUB_TOKEN=your-personal-access-token-here
```

## Development

Run the server in development mode with auto-reload:
```bash
npm run dev
```

## Production

Build and run for production:
```bash
npm run build
npm start
```

## API Usage

### Endpoint 1: `GET /api/yaml`

Fetch a YAML file from any GitLab instance by providing the full blob URL.

#### Query Parameters:
- `url` (required) - Full GitLab blob URL (e.g., `https://gitlab.com/group/project/-/blob/main/config.yml`)

#### Example:
```
GET /api/yaml?url=https://gitlab.com/mygroup/myproject/-/blob/main/config.yml
```

#### Frontend Usage:
```typescript
export async function fetchYaml<T>(url: string): Promise<T | null> {
  const proxyUrl = `http://localhost:8080/api/yaml?url=${encodeURIComponent(url)}`;

  try {
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

    const text = await res.text();
    const parsed = yaml.load(text) as T;

    return parsed;
  } catch (err) {
    return null;
  }
}
```


#### Response (Both Endpoints):
- `200` - YAML file contents (text/yaml)
- `304` - Not Modified (when ETag matches)
- `400` - Invalid query parameters or unknown registry key
- `429` - Rate limit exceeded
- `502` - Upstream GitLab fetch failed

## Security

- CORS configured to allow only specified origins (set via `CORS_ALLOWED_ORIGINS` env var)
- Helmet security headers enabled
- Rate limiting enforced (60 requests/minute per IP)
- File path restricted to YAML files only
- GitLab tokens stored in environment variables
- URL validation with Zod schemas

## Configuration

### CORS Origins
To allow multiple origins, separate them with commas in your `.env`:
```env
CORS_ALLOWED_ORIGINS=https://localhost:5173,https://app.example.com,https://staging.example.com
```

### GitLab Instances
Edit the `REGISTRY` object in [server.ts:18](server.ts#L18) to add or modify GitLab instances. Each instance requires:
- `base`: GitLab instance URL (e.g., `https://gitlab.com`)
- `token`: Optional private token for authentication (read from env vars)
