import { useState, useEffect } from 'react';
import { App, AppModule } from '../types';
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
       // 1. Fetch the list of app folders (from JSON manifest)
        const manifestUrl = '/apps/manifest.json';
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error('Could not load app manifest');
        const manifest: { apps: string[] } = await res.json();

        // 2. For each app, fetch its info
        const appPromises = manifest.apps.map(async (appFolder) => {
          const appData = await fetchYaml<any>(`/apps/${appFolder}/app.yml`);
          if (!appData) return null;
          
          const modulePaths: string[] = appData.modules || [];
          console.log(`Modules defined in app.yml for ${appFolder}:`, modulePaths);

          const modulePromises = modulePaths.map((relPath) =>
            fetchYaml<AppModule>(`/apps/${appFolder}/${relPath}`)
          );
          const modules = (await Promise.all(modulePromises)).filter(Boolean) as AppModule[];

          const { modules: _, ...appCoreData } = appData;

          return {
            ...appCoreData,
            modules,
            modulePaths,
          } as App;
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