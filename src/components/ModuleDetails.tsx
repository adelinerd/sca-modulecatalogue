import React from 'react';
import { AppModule } from '../types';
import { ExternalLink, Calendar, Package, Info, Phone, Mail, Users, Settings, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleDetailsProps {
  module: AppModule;
}

const ModuleDetails: React.FC<ModuleDetailsProps> = ({ module }) => {
  const { t } = useTranslation();
  
  if (!module) return null;

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fadeIn">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{module.name}</h1>
        {module.topic && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('moduleDetails.topic')}: {module.topic}
          </p>
        )}
        {module.short_description && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">{module.short_description}</p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            {t('moduleDetails.overview')}
          </h2>
          
          {module.optional && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.optional')}
              </h3>
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded-full
                ${module.optional === 'ja' || module.optional === 'yes'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }
              `}>
                {module.optional}
              </span>
            </div>
          )}
          
          {module.development_status && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.status')}
              </h3>
              <span className={`
                inline-block px-2 py-1 text-xs font-medium rounded-full
                ${module.development_status === 'Stable' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : module.development_status === 'Beta'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }
              `}>
                {module.development_status}
              </span>
            </div>
          )}
          
          {module.last_update && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.lastUpdate')}
              </h3>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{module.last_update}</span>
              </div>
            </div>
          )}

          {module.cost && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.cost')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{module.cost}</p>
            </div>
          )}

          {module.opencode_repository && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.repository')}
              </h3>
              <a
                href={module.opencode_repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('moduleDetails.viewRepository')}
              </a>
            </div>
          )}

          {module.technical_documentation && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('moduleDetails.documentation')}
              </h3>
              <a
                href={module.technical_documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                {t('moduleDetails.viewDocumentation')}
              </a>
            </div>
          )}
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-blue-500" />
            {t('moduleDetails.technical')}
          </h2>

          {module.interfaces && module.interfaces.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('moduleDetails.interfaces')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {module.interfaces.map((interface_, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
                  >
                    {interface_}
                  </span>
                ))}
              </div>
            </div>
          )}

          {module.dependencies && module.dependencies.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('moduleDetails.dependencies')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {module.dependencies.map((dependency, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {dependency}
                  </span>
                ))}
              </div>
            </div>
          )}

          {module.deployed_in_municipalities && module.deployed_in_municipalities.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('moduleDetails.deployments')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {module.deployed_in_municipalities.map((municipality, index) => (
                  <span 
                    key={index}
                    className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full"
                  >
                    {municipality}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {module.description && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('moduleDetails.description')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{module.description}</p>
        </section>
      )}

      {module.usage_scenario && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('moduleDetails.usageScenario')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{module.usage_scenario}</p>
        </section>
      )}

      {module.external_services && module.external_services.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('moduleDetails.externalServices')}
          </h2>
          <div className="space-y-4">
            {module.external_services.map((service, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">{service.name}</h3>
                {service.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{service.description}</p>
                )}
                {service.url && (
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {t('moduleDetails.learnMore')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {module.customization_options && module.customization_options.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            {t('moduleDetails.customizationOptions')}
          </h2>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {module.customization_options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </section>
      )}

      {module.involved_actors && module.involved_actors.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            {t('moduleDetails.involvedActors')}
          </h2>
          <div className="space-y-3">
            {module.involved_actors.map((actor, index) => (
              <div key={index} className="border dark:border-gray-700 rounded-lg p-3">
                <div className="font-medium text-gray-800 dark:text-white">{actor.name}</div>
                {actor.role && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{actor.role}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModuleDetails;