import { useState, useEffect } from 'react';
import { App } from '../types';
import yaml from 'js-yaml';

// Helper to fetch YAML safely
async function fetchYaml<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    return yaml.load(text) as T;
  } catch {
    return null;
  }
}

const useAppData = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // 1. Fetch the list of app folders (assume a manifest file exists)
        const manifestUrl = '/apps/manifest.json';
        const manifest = await fetchYaml<{ apps: string[] }>(manifestUrl);
        if (!manifest) throw new Error('Could not load app manifest');

        // 2. For each app, fetch its info
        const appPromises = manifest.apps.map(async (appFolder) => {
          const appInfo = await fetchYaml<App>(`/apps/${appFolder}/app.yml`);
          return appInfo;
        });

        const loadedApps = (await Promise.all(appPromises)).filter(Boolean) as App[];
        setApps(loadedApps);
        setLoading(false);
      } catch (err) {
        setError('Failed to load app data');
        setLoading(false);
        console.error('Error loading app data:', err);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error };
};

export default useAppData;