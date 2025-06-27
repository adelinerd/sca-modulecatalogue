import { useState, useEffect } from 'react';
import { CityApp, AppModule } from '../types';
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

interface ManifestApp {
  name: string;
  app_yml_url: string;
}

interface Manifest {
  apps: ManifestApp[];
}

const useAppData = () => {
  const [apps, setApps] = useState<CityApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // 1. Fetch the manifest with app names and URLs
        const manifestUrl = '/apps/manifest.json';
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error('Could not load app manifest');
        const manifest: Manifest = await res.json();

        console.log('Loaded manifest:', manifest);

        // 2. For each app, fetch its YAML data from the specified URL
        const appPromises = manifest.apps.map(async (manifestApp) => {
          console.log(`Fetching app data from: ${manifestApp.app_yml_url}`);
          const appData = await fetchYaml<any>(manifestApp.app_yml_url);
          if (!appData) {
            console.warn(`Failed to load app data from ${manifestApp.app_yml_url}`);
            return null;
          }
          
          // 3. For each module URL in the app, fetch the module data
          const moduleUrls: string[] = appData.modules || [];
          console.log(`Module URLs for ${manifestApp.name}:`, moduleUrls);

          const modulePromises = moduleUrls.map(async (moduleUrl) => {
            console.log(`Fetching module from: ${moduleUrl}`);
            const moduleData = await fetchYaml<AppModule>(moduleUrl);
            if (!moduleData) {
              console.warn(`Failed to load module from ${moduleUrl}`);
            }
            return moduleData;
          });
          
          const modules = (await Promise.all(modulePromises)).filter(Boolean) as AppModule[];
          console.log(`Loaded ${modules.length} modules for ${manifestApp.name}`);

          // Remove the modules URLs from app data and replace with actual module objects
          const { modules: _, ...appCoreData } = appData;

          return {
            ...appCoreData,
            modules,
            moduleUrls, // Keep the original URLs for reference if needed
          } as CityApp;
        });

        const loadedApps = (await Promise.all(appPromises)).filter(Boolean) as CityApp[];
        console.log(`Successfully loaded ${loadedApps.length} apps`);
        setApps(loadedApps);
        setLoading(false);
      } catch (err) {
        console.error('Error loading app data:', err);
        setError('Failed to load app data');
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error };
};

export default useAppData;