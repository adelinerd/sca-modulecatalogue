import yaml from 'js-yaml';
import { getCached, setCached } from './cache';

/**
 * Converts a GitHub or GitLab blob URL into its raw file URL.
 */
export function toRawURL(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);

    // GitHub (e.g., github.com/user/repo/blob/branch/path/file.yml)
    if (u.hostname === 'github.com') {
      const [user, repo, blob, branch, ...path] = parts;
      if (blob !== 'blob') throw new Error('Invalid GitHub blob URL');
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path.join('/')}`;
    }

    // GitLab (self-hosted or gitlab.com)
    if (u.hostname.includes('gitlab')) {
      const blobIndex = parts.indexOf('blob');
      if (blobIndex === -1) throw new Error('Invalid GitLab blob URL');

      const groupAndProject = parts.slice(0, blobIndex - 1).join('/');
      const branch = parts[blobIndex + 1];
      const path = parts.slice(blobIndex + 2).join('/');

      return `https://cors-anywhere.herokuapp.com/corsdemo/${u.origin}/${groupAndProject}/-/raw/${branch}/${path}`;
    }

    // If already raw or unsupported, return as-is
    return url;
  } catch (err) {
    console.error('Invalid URL:', (err as Error).message);
    return url;
  }
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
    const res = await fetch(rawUrl, { headers: { 'Access-Control-Allow-Origin': '*' }});
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

    const text = await res.text();
    const parsed = yaml.load(text) as T;

    setCached(rawUrl, parsed);
    return parsed;
  } catch (err) {
    console.error(`Failed to fetch or parse YAML from ${rawUrl}:`, err);
    return null;
  }
}