// cache.ts
const memoryCache = new Map<string, any>();

const CACHE_PREFIX = 'yaml-cache/';
const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours

export function getCached<T>(url: string): T | null {
  // 1. Check in-memory
  if (memoryCache.has(url)) {
    return memoryCache.get(url);
  }

  // 2. Check localStorage
  const raw = localStorage.getItem(CACHE_PREFIX + url);
  if (!raw) return null;

  try {
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) {
      // Expired
      localStorage.removeItem(CACHE_PREFIX + url);
      return null;
    }

    memoryCache.set(url, data); // Restore to memory
    return data;
  } catch {
    return null;
  }
}

export function setCached<T>(url: string, data: T): void {
  memoryCache.set(url, data);

  const record = {
    timestamp: Date.now(),
    data,
  };

  try {
    localStorage.setItem(CACHE_PREFIX + url, JSON.stringify(record));
  } catch (e) {
    console.warn('localStorage quota exceeded or unsupported', e);
  }
}
