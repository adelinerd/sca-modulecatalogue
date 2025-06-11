import React from 'react';
import { AppModule } from '../types';
import { X, Calendar, Package, ExternalLink, AlertCircle, Settings, Users, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleCompareViewProps {
  modules: AppModule[];
  onClose: () => void;
  onRemoveModule: (module: AppModule) => void;
}

const ModuleCompareView: React.FC<ModuleCompareViewProps> = ({ modules, onClose, onRemoveModule }) => {
  const { t } = useTranslation();

  if (modules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50 mb-2">
            {t('moduleCompareView.empty.title')}
          </h3>
          <p className="text-primary-600 dark:text-primary-400">
            {t('moduleCompareView.empty.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto animate-fadeIn">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-primary-100 dark:border-primary-900 p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
          {t('moduleCompareView.title', { count: modules.length })}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          aria-label="Close module comparison view"
        >
          <X className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </button>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <div key={`${module.name}-${index}`} className="relative">
              <button
                onClick={() => onRemoveModule(module)}
                className="absolute right-2 top-2 p-1.5 rounded-full bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors z-10"
                aria-label={`Remove ${module.name} from comparison`}
              >
                <X className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-primary-100 dark:border-primary-900">
                <div className="bg-primary-50 dark:bg-primary-900/50 px-4 py-3 border-b border-primary-100 dark:border-primary-900">
                  <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">{module.name}</h3>
                  {module.topic && (
                    <p className="text-sm text-primary-600 dark:text-primary-400">{module.topic}</p>
                  )}
                  {module.short_description && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">{module.short_description}</p>
                  )}
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      {t('moduleCompareView.details.title')}
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-primary-600 dark:text-primary-400">{t('moduleCompareView.details.status')}</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {module.development_status || t('moduleCompareView.details.notSpecified')}
                      </dd>
                      <dt className="text-primary-600 dark:text-primary-400">{t('moduleCompareView.details.lastUpdate')}</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {module.last_update || t('moduleCompareView.details.notSpecified')}
                      </dd>
                      <dt className="text-primary-600 dark:text-primary-400">{t('moduleCompareView.details.optional')}</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {module.optional || t('moduleCompareView.details.notSpecified')}
                      </dd>
                      <dt className="text-primary-600 dark:text-primary-400">{t('moduleCompareView.details.cost')}</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {module.cost || t('moduleCompareView.details.notSpecified')}
                      </dd>
                    </dl>
                  </div>
                  
                  {/* Technical Details */}
                  {(module.interfaces?.length || module.dependencies?.length) && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Wrench className="h-4 w-4 mr-2 text-primary-500" />
                        {t('moduleCompareView.technical.title')}
                      </h4>
                      <div className="space-y-2">
                        {module.interfaces && module.interfaces.length > 0 && (
                          <div>
                            <dt className="text-xs text-primary-600 dark:text-primary-400 mb-1">
                              {t('moduleCompareView.technical.interfaces')}
                            </dt>
                            <div className="flex flex-wrap gap-1">
                              {module.interfaces.slice(0, 3).map((interface_, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 text-xs bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                                  {interface_}
                                </span>
                              ))}
                              {module.interfaces.length > 3 && (
                                <span className="text-xs text-primary-500 dark:text-primary-400">
                                  +{module.interfaces.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {module.dependencies && module.dependencies.length > 0 && (
                          <div>
                            <dt className="text-xs text-primary-600 dark:text-primary-400 mb-1">
                              {t('moduleCompareView.technical.dependencies')}
                            </dt>
                            <div className="flex flex-wrap gap-1">
                              {module.dependencies.slice(0, 3).map((dep, i) => (
                                <span key={i} className="inline-block px-2 py-0.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                                  {dep}
                                </span>
                              ))}
                              {module.dependencies.length > 3 && (
                                <span className="text-xs text-primary-500 dark:text-primary-400">
                                  +{module.dependencies.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Links */}
                  <div>
                    <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-primary-500" />
                      {t('moduleCompareView.resources.title')}
                    </h4>
                    <div className="space-y-2">
                      {module.technical_documentation && (
                        <a
                          href={module.technical_documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                        >
                          {t('moduleCompareView.resources.documentation')}
                        </a>
                      )}
                      {module.opencode_repository && (
                        <a
                          href={module.opencode_repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                        >
                          {t('moduleCompareView.resources.repository')}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Deployments */}
                  {module.deployed_in_municipalities && module.deployed_in_municipalities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-primary-500" />
                        {t('moduleCompareView.deployments.title')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {module.deployed_in_municipalities.slice(0, 4).map((municipality, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
                          >
                            {municipality}
                          </span>
                        ))}
                        {module.deployed_in_municipalities.length > 4 && (
                          <span className="text-xs text-primary-500 dark:text-primary-400">
                            +{module.deployed_in_municipalities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* External Services */}
                  {module.external_services && module.external_services.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-primary-500" />
                        {t('moduleCompareView.externalServices.title')} ({module.external_services.length})
                      </h4>
                      <div className="space-y-2">
                        {module.external_services.slice(0, 3).map((service, index) => (
                          <div 
                            key={index}
                            className="border border-primary-100 dark:border-primary-900 rounded p-2"
                          >
                            <div className="font-medium text-primary-900 dark:text-primary-50 text-sm">
                              {service.name}
                            </div>
                            {service.description && (
                              <p className="text-xs text-primary-600 dark:text-primary-400 line-clamp-2">
                                {service.description}
                              </p>
                            )}
                          </div>
                        ))}
                        {module.external_services.length > 3 && (
                          <p className="text-xs text-primary-500 dark:text-primary-400">
                            +{module.external_services.length - 3} more services
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Involved Actors */}
                  {module.involved_actors && module.involved_actors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Users className="h-4 w-4 mr-2 text-primary-500" />
                        {t('moduleCompareView.actors.title')} ({module.involved_actors.length})
                      </h4>
                      <div className="space-y-1">
                        {module.involved_actors.slice(0, 3).map((actor, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium text-primary-900 dark:text-primary-50">{actor.name}</span>
                            {actor.role && (
                              <span className="text-primary-600 dark:text-primary-400 text-xs ml-1">- {actor.role}</span>
                            )}
                          </div>
                        ))}
                        {module.involved_actors.length > 3 && (
                          <p className="text-xs text-primary-500 dark:text-primary-400">
                            +{module.involved_actors.length - 3} more actors
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleCompareView;