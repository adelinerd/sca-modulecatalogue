/*
 * Modulbibliothek
 *
 * Copyright (c) 2026 Fraunhofer IESE, Adeline Silva Schäfer
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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

export function clearCache(url?: string): void {
  if (url) {
    // Clear specific URL
    memoryCache.delete(url);
    localStorage.removeItem(CACHE_PREFIX + url);
  } else {
    // Clear all cache
    memoryCache.clear();
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}
