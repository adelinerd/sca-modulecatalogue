import { useState, useEffect } from 'react';
import { CityApp, AppModule } from '../types';
import yaml from 'js-yaml';



export function toRawURL(url: string): string {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean); // remove empty elements

    // GitHub.com
    if (u.hostname === 'github.com') {
      const [user, repo, blob, branch, ...path] = parts;
      if (blob !== 'blob') throw new Error('Invalid GitHub blob URL format');
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path.join('/')}`;
    }

    // GitLab (self-hosted or gitlab.com)
    if (u.hostname.includes('gitlab')) {
      const blobIndex = parts.indexOf('blob');
      if (blobIndex === -1 || parts[blobIndex - 1] !== '-') {
        throw new Error('Invalid GitLab blob URL format');
      }

      const groupAndProject = parts.slice(0, blobIndex - 1).join('/');
      const branch = parts[blobIndex + 1];
      const filePath = parts.slice(blobIndex + 2).join('/');

      return `${u.origin}/${groupAndProject}/-/raw/${branch}/${filePath}`;
    }

    // Fallback: return original (might already be raw)
    return url;
  } catch (err) {
    console.error('Invalid URL:', (err as Error).message);
    return url; // fallback for invalid URLs
  }
}


// Helper to fetch YAML safely
export async function fetchYaml<T>(url: string): Promise<T | null> {
  const rawUrl = toRawURL(url);

  try {
    console.log(`Fetching YAML from: ${rawUrl}`);
    const res = await fetch(rawUrl);
    
    if (!res.ok) {
      console.error(`Failed to fetch ${rawUrl}: ${res.status} ${res.statusText}`);
      return null;
    }

    const text = await res.text();
    console.log(`Successfully fetched YAML from ${rawUrl}, content length: ${text.length}`);    

    const parsed = yaml.load(text) as T;

    return parsed;
  } catch (error) {
    console.error(`Error fetching YAML from ${rawUrl}:`, error);
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
        console.log('Fetching manifest from:', manifestUrl);
        
        const res = await fetch(manifestUrl);
        if (!res.ok) throw new Error(`Could not load app manifest: ${res.status} ${res.statusText}`);
        const manifest: Manifest = await res.json();

        console.log('Loaded manifest:', manifest);

        // 2. For each app, fetch its YAML data from the specified URL
        const appPromises = manifest.apps.map(async (manifestApp, index) => {
          try {
            console.log(`\n=== Processing app ${index + 1}/${manifest.apps.length}: ${manifestApp.name} ===`);            
            console.log(`App YAML URL: ${manifestApp.app_yml_url}`);
            
            const appData = await fetchYaml<any>(manifestApp.app_yml_url);
            if (!appData) {
              console.warn(`Failed to load app data for ${manifestApp.name} from ${manifestApp.app_yml_url}`);
              return null;
            }
            
            console.log(`Raw app data for ${manifestApp.name}:`, appData);
            
            // Log app_type specifically
            if (appData.app_type) {
              console.log(`✅ App type found for ${manifestApp.name}: "${appData.app_type}"`);
            } else {
              console.log(`⚠️  No app_type field found for ${manifestApp.name}`);
              console.log(`Available fields in app data:`, Object.keys(appData));
            }
            
            // Validate that we have a name
            if (!appData.name && !manifestApp.name) {
              console.error(`No name found for app from ${manifestApp.app_yml_url}`);
              return null;
            }
            
            // 3. For each module URL in the app, fetch the module data
            const moduleUrls: string[] = appData.modules || [];
            console.log(`Module URLs for ${manifestApp.name} (${moduleUrls.length} modules):`, moduleUrls);

            if (moduleUrls.length === 0) {
              console.log(`No modules defined for ${manifestApp.name}`);
            }

            const modulePromises = moduleUrls.map(async (moduleUrl, moduleIndex) => {
              try {
                console.log(`  Fetching module ${moduleIndex + 1}/${moduleUrls.length} from: ${moduleUrl}`);
                const moduleData = await fetchYaml<AppModule>(moduleUrl);
                if (!moduleData) {
                  console.warn(`  Failed to load module from ${moduleUrl}`);
                  return null;
                }
                
                // Add app_name to module if not present
                if (!moduleData.app_name) {
                  moduleData.app_name = appData.name || manifestApp.name;
                  console.log(`  Added app_name "${moduleData.app_name}" to module "${moduleData.name}"`);
                }
                
                console.log(`  ✅ Successfully loaded module: ${moduleData.name}`);
                return moduleData;
              } catch (error) {
                console.error(`  Error loading module from ${moduleUrl}:`, error);
                return null;
              }
            });
            
            const modules = (await Promise.all(modulePromises)).filter(Boolean) as AppModule[];
            console.log(`Loaded ${modules.length}/${moduleUrls.length} modules for ${manifestApp.name}`);

            // Create the final app object, ensuring we have the name field
            const finalApp: CityApp = {
              // Use the name from YAML if available, otherwise fall back to manifest name
              name: appData.name || manifestApp.name,
              provider: appData.provider,
              short_description: appData.short_description,
              website: appData.website,
              contact: appData.contact,
              deployed_in_municipalities: appData.deployed_in_municipalities,
              opencode_repository: appData.opencode_repository,
              documentation: appData.documentation,
              app_type: appData.app_type, // Include app_type
              development_status: appData.development_status,
              last_update: appData.last_update,
              modules,
              moduleUrls, // Keep the original URLs for reference if needed
            };
            
            // Log final app object with app_type
            console.log(`Final app object for ${finalApp.name}:`);
            console.log(`  - Name: ${finalApp.name}`);
            console.log(`  - Provider: ${finalApp.provider || 'Not specified'}`);
            console.log(`  - App Type: ${finalApp.app_type || 'Not specified'}`);
            console.log(`  - Development Status: ${finalApp.development_status || 'Not specified'}`);
            console.log(`  - Modules: ${finalApp.modules?.length || 0}`);
            console.log(`=== End processing ${finalApp.name} ===\n`);
            
            return finalApp;
          } catch (error) {
            console.error(`Error processing app ${manifestApp.name}:`, error);
            return null;
          }
        });

        const loadedApps = (await Promise.all(appPromises)).filter(Boolean) as CityApp[];
        console.log(`\n🎉 FINAL RESULT: Successfully loaded ${loadedApps.length}/${manifest.apps.length} apps`);
        
        // Log summary of all loaded apps with their app_types
        console.log('\n📋 LOADED APPS SUMMARY:');
        loadedApps.forEach((app, index) => {
          console.log(`${index + 1}. ${app.name}`);
          console.log(`   - Provider: ${app.provider || 'Not specified'}`);
          console.log(`   - App Type: ${app.app_type || 'Not specified'}`);
          console.log(`   - Status: ${app.development_status || 'Not specified'}`);
          console.log(`   - Modules: ${app.modules?.length || 0}`);
        });
        
        if (loadedApps.length === 0) {
          throw new Error('No apps could be loaded successfully');
        }
        
        setApps(loadedApps);
        setLoading(false);
      } catch (err) {
        console.error('Error loading app data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load app data');
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error };
};

export default useAppData;