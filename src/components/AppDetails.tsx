import React from 'react';
import { App } from '../types';
import { ExternalLink, Calendar, Server, Users, Info, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppDetailsProps {
  app: App;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app }) => {
  const { t } = useTranslation();
  
  if (!app) return null;

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fadeIn">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{app.name}</h1>
        {app.provider && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('appCard.provider', { provider: app.provider })}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            {t('appDetails.overview')}
          </h2>
          
          {app.development_status && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.status')}
              </h3>
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded-full
                ${app.development_status === 'Stable' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : app.development_status === 'Beta'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }
              `}>
                {app.development_status}
              </span>
            </div>
          )}
          
          {app.last_update && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.lastUpdate')}
              </h3>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{app.last_update}</span>
              </div>
            </div>
          )}

          {app.documentation && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.documentation')}
              </h3>
              <a
                href={app.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('appDetails.viewDocumentation')}
              </a>
            </div>
          )}

          {app.website && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.website')}
              </h3>
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('appDetails.visitWebsite')}
              </a>
            </div>
          )}

          {app.opencode_repository && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.repository')}
              </h3>
              <a
                href={app.opencode_repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('appDetails.viewRepository')}
              </a>
            </div>
          )}
        </section>

        {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
              <Server className="h-5 w-5 mr-2 text-blue-500" />
              {t('appDetails.deployments')}
            </h2>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('compareView.deployments.title')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {app.deployed_in_municipalities.map((municipality, index) => (
                  <span 
                    key={index}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {municipality}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {app.modules && app.modules.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            {t('appDetails.modules')}
          </h2>
          <div className="space-y-4">
            {app.modules.map((module, index) => (
              <div 
                key={index}
                className="border dark:border-gray-700 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{module.name}</h3>
                
                {module.topic && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                      {module.topic}
                    </span>
                  </div>
                )}
                
                {module.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{module.description}</p>
                )}
                
                {module.use_cases && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('appDetails.useCases')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{module.use_cases}</p>
                  </div>
                )}
                
                {module.external_services && module.external_services.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('appDetails.externalServices')}
                    </h4>
                    <ul className="space-y-2">
                      {module.external_services.map((service, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{service.name}</span>
                          {service.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
                          )}
                          {service.url && (
                            <a
                              href={service.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center mt-1"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {t('appDetails.learnMore')}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {module.customization_options && module.customization_options.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('appDetails.customizationOptions')}
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                      {module.customization_options.map((option, i) => (
                        <li key={i}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AppDetails;