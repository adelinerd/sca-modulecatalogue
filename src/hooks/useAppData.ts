import { useState, useEffect } from 'react';
import { App } from '../types';

// In a real application, this would fetch from a git repository or API
// For now, we're using mock data
const useAppData = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // In a real implementation, this would fetch from actual files
        // For now, we're hardcoding the example data
        const mockApps: App[] = [
          {
            name: "DorfFunk",
            provider: "Fraunhofer IESE",
            technical_specifications: "",
            documentation: "https://gitlab.opencode.de/fraunhofer-iese/digitale-doerfer/dorffunk/-/tree/main/docs?ref_type=heads",
            deployed_in_municipalities: [
              "Niedersachsen",
              "RLP",
              "…"
            ],
            website: "https://www.digitale-doerfer.de/unsere-loesungen/dorffunk",
            opencode_repository: "https://gitlab.opencode.de/fraunhofer-iese/digitale-doerfer/dorffunk",
            modules: []
          },
          {
            name: "Events",
            provider: "Fraunhofer IESE",
            technical_specifications: "",
            documentation: "https://opencode.de/en/software/dorf-funk-4774",
            deployed_in_municipalities: [
              "Amt Haddeby",
              "Gleichen",
              "Bingen",
              "Tetenhusen"
            ],
            development_status: "Stable",
            last_update: "2025-04-16",
            modules: [
              {
                name: "Event Calendar",
                topic: "Veranstaltungskalender",
                description: "Hier können Bürger*innen Vorschläge oder Mängel der Gemeinde mitteilen. Die Nachricht landet direkt bei der richtigen Ansprechperson.",
                use_cases: "Ermöglicht es Bürgerinnen und Bürgern, Schäden oder Störungen im öffentlichen Raum – wie defekte Straßenlaternen oder Schlaglöcher – schnell und unkompliziert an die zuständige Behörde zu melden",
                external_services: [
                  {
                    name: "DorfNews",
                    description: "Der Kanal wird nur aktiviert, wenn LösBar mitbestellt ist.",
                    url: "https://www.digitale-doerfer.de/unsere-loesungen/loesbar/?portfolioCats=68%2C70%2C69%2C97"
                  }
                ],
                customization_options: [
                  "Erstellung von Events durch Bürger: erlaubt oder nicht"
                ]
              }
            ]
          },
          {
            name: "Smart City Hub",
            provider: "Digital Communities",
            documentation: "https://example.com/smart-city-hub/docs",
            deployed_in_municipalities: [
              "Berlin",
              "Hamburg",
              "Munich",
              "Cologne"
            ],
            website: "https://example.com/smart-city-hub",
            development_status: "Beta",
            last_update: "2025-03-10",
            modules: [
              {
                name: "Traffic Monitor",
                topic: "Urban Mobility",
                description: "Real-time traffic monitoring and prediction for urban areas.",
                use_cases: "Helps citizens and city planners optimize routes and reduce congestion in urban centers."
              },
              {
                name: "Air Quality",
                topic: "Environment",
                description: "Monitors air quality across the city with multiple sensor points.",
                use_cases: "Provides real-time air quality data to citizens and enables environmental policy decisions."
              }
            ]
          },
          {
            name: "CityConnect",
            provider: "Urban Solutions GmbH",
            documentation: "https://cityconnect.dev/documentation",
            deployed_in_municipalities: [
              "Frankfurt",
              "Dresden",
              "Stuttgart"
            ],
            website: "https://cityconnect.dev",
            development_status: "Production",
            last_update: "2025-02-15",
            modules: [
              {
                name: "Citizen Feedback",
                topic: "Citizen Engagement",
                description: "Platform for citizens to provide feedback on city services and infrastructure.",
                use_cases: "Enables direct communication between citizens and municipal authorities."
              }
            ]
          }
        ];
        
        setApps(mockApps);
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