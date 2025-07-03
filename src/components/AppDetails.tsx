import React, { useState } from 'react';
import { CityApp, AppModule } from '../types';
import { ExternalLink, Calendar, Server, Users, Info, Package, Phone, Mail, ChevronLeft, ChevronRight, Grid, List, Image, Smartphone, Globe, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppDetailsProps {
  app: CityApp;
  onModuleClick?: (module: AppModule, fromApp: CityApp) => void;
}

const AppDetails: React.FC<AppDetailsProps> = ({ app, onModuleClick }) => {
  const { t } = useTranslation();
  const [currentModulePage, setCurrentModulePage] = useState(1);
  const [moduleViewMode, setModuleViewMode] = useState<'grid' | 'list'>('grid');
  const [moduleImageIndices, setModuleImageIndices] = useState<{[key: string]: number}>({});
  const modulesPerPage = 6;
  
  if (!app) return null;

  const modules = Array.isArray(app.modules) ? app.modules : [];
  const totalModulePages = Math.ceil(modules.length / modulesPerPage);
  const startIndex = (currentModulePage - 1) * modulesPerPage;
  const endIndex = startIndex + modulesPerPage;
  const currentModules = modules.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentModulePage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentModulePage(prev => Math.min(totalModulePages, prev + 1));
  };

  // Image gallery handlers for modules
  const getModuleScreenshots = (module: any) => {
    if (!module.screenshots) return [];
    return Array.isArray(module.screenshots) ? module.screenshots : [module.screenshots];
  };

  const handleModulePreviousImage = (moduleKey: string, screenshots: string[]) => {
    setModuleImageIndices(prev => ({
      ...prev,
      [moduleKey]: prev[moduleKey] === 0 || prev[moduleKey] === undefined 
        ? screenshots.length - 1 
        : prev[moduleKey] - 1
    }));
  };

  const handleModuleNextImage = (moduleKey: string, screenshots: string[]) => {
    setModuleImageIndices(prev => ({
      ...prev,
      [moduleKey]: prev[moduleKey] === screenshots.length - 1 || prev[moduleKey] === undefined 
        ? 0 
        : (prev[moduleKey] || 0) + 1
    }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleModuleCardClick = (module: AppModule) => {
    if (onModuleClick) {
      onModuleClick(module, app);
    }
  };

  // Get app type icon
  const getAppTypeIcon = (appType?: string) => {
    if (!appType) return <Package className="h-4 w-4" />;
    
    const type = appType.toLowerCase();
    if (type.includes('native') || type.includes('mobile')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (type.includes('web')) {
      return <Globe className="h-4 w-4" />;
    } else if (type.includes('desktop')) {
      return <Monitor className="h-4 w-4" />;
    }
    return <Package className="h-4 w-4" />;
  };

  const ModuleImageGallery: React.FC<{ module: any; moduleKey: string; className?: string }> = ({ 
    module, 
    moduleKey, 
    className = "h-32" 
  }) => {
    const screenshots = getModuleScreenshots(module);
    const currentIndex = moduleImageIndices[moduleKey] || 0;
    const hasImages = screenshots.length > 0;
    const showNavigation = screenshots.length > 1;

    return (
      <div className={`relative ${className} bg-gray-100 dark:bg-gray-700 overflow-hidden rounded-lg`}>
        {hasImages ? (
          <>
            <img
              src={screenshots[currentIndex]}
              alt={`${module.name} screenshot ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={handleImageError}
            />
            
            {/* Image Navigation */}
            {showNavigation && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModulePreviousImage(moduleKey, screenshots);
                  }}
                  className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleNextImage(moduleKey, screenshots);
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModuleImageIndices(prev => ({
                          ...prev,
                          [moduleKey]: index
                        }));
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        index === currentIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Image Count Badge */}
            {screenshots.length > 1 && (
              <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-full">
                {currentIndex + 1}/{screenshots.length}
              </div>
            )}
          </>
        ) : (
          // Placeholder when no images
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
            <div className="text-center">
              <Image className="h-6 w-6 text-primary-400 dark:text-primary-500 mx-auto mb-1" />
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {t('moduleCard.noImage')}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fadeIn">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{app.name}</h1>
        {app.provider && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('appCard.provider', { provider: app.provider })}
          </p>
        )}
        {app.short_description && (
          <p className="text-gray-600 dark:text-gray-300 mt-2">{app.short_description}</p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            {t('appDetails.overview')}
          </h2>
          
          {/* App Type */}
          {app.app_type && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('appDetails.appType')}
              </h3>
              <div className="flex items-center">
                <span className="mr-2 text-gray-500 dark:text-gray-400">
                  {getAppTypeIcon(app.app_type)}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{app.app_type}</span>
              </div>
            </div>
          )}
          
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

          {app.contact && app.contact.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('appDetails.contact')}
              </h3>
              <div className="space-y-2">
                {app.contact.map((contact, index) => (
                  <div key={index} className="flex flex-col space-y-1">
                    {contact.email && (
                      <a
                        href={contact.email.startsWith('http') ? contact.email : `mailto:${contact.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        {contact.email.startsWith('http') ? t('appDetails.contactForm') : contact.email}
                      </a>
                    )}
                    {contact.telefon && (
                      <a
                        href={`tel:${contact.telefon}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        {contact.telefon}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Development Partnership */}
          {app.development_partnership && app.development_partnership.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('appDetails.developmentPartnership')}
              </h3>
              <div className="space-y-2">
                {app.development_partnership.map((partnership, index) => (
                  <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-medium">{partnership.name}</div>
                    {partnership.kontakt && (
                      <div className="text-xs">{partnership.kontakt}</div>
                    )}
                  </div>
                ))}
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

      {modules.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Module Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                {t('appDetails.modules')} ({modules.length})
              </h2>
              
              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setModuleViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      moduleViewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setModuleViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      moduleViewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                    title="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Pagination Controls */}
                {totalModulePages > 1 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentModulePage === 1}
                      className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <span className="text-sm text-gray-600 dark:text-gray-300 px-2">
                      {currentModulePage} / {totalModulePages}
                    </span>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentModulePage === totalModulePages}
                      className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Module Content */}
          <div className="p-6">
            {moduleViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentModules.map((module, index) => {
                  const moduleKey = `${startIndex + index}-${module.name}`;
                  return (
                    <div 
                      key={moduleKey}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600/50"
                      onClick={() => handleModuleCardClick(module)}
                    >
                      {/* Module Image Gallery */}
                      <ModuleImageGallery 
                        module={module} 
                        moduleKey={moduleKey}
                        className="h-32"
                      />
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-medium text-gray-800 dark:text-white line-clamp-2 flex-1">{module.name}</h3>
                          {module.development_status && (
                            <span className={`
                              text-xs px-2 py-0.5 rounded-full whitespace-nowrap ml-2
                              ${module.development_status === 'Stable' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                : module.development_status === 'Beta'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              }
                            `}>
                              {module.development_status}
                            </span>
                          )}
                        </div>
                        
                        {module.topic && (
                          <div className="mb-2">
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                              {module.topic}
                            </span>
                          </div>
                        )}

                        {module.short_description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium line-clamp-3">{module.short_description}</p>
                        )}
                        
                        {module.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-4">{module.description}</p>
                        )}

                        {/* Quick Info */}
                        <div className="space-y-2 text-xs">
                          {module.cost && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <span className="font-medium mr-1">{t('appDetails.cost')}:</span>
                              <span className="truncate">{module.cost}</span>
                            </div>
                          )}
                          
                          {module.optional && (
                            <div className="flex items-center">
                              <span className="inline-block px-2 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full">
                                {t('appDetails.optional')}: {module.optional}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {currentModules.map((module, index) => {
                  const moduleKey = `${startIndex + index}-${module.name}`;
                  return (
                    <div 
                      key={moduleKey}
                      className="border dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      onClick={() => handleModuleCardClick(module)}
                    >
                      <div className="flex">
                        {/* Module Image Gallery - Left Side */}
                        <div className="w-48 flex-shrink-0">
                          <ModuleImageGallery 
                            module={module} 
                            moduleKey={moduleKey}
                            className="h-32"
                          />
                        </div>
                        
                        {/* Module Content - Right Side */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{module.name}</h3>
                            {module.development_status && (
                              <span className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${module.development_status === 'Stable' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : module.development_status === 'Beta'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                }
                              `}>
                                {module.development_status}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {module.topic && (
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                                {module.topic}
                              </span>
                            )}
                            {module.optional && (
                              <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded-full">
                                {t('appDetails.optional')}: {module.optional}
                              </span>
                            )}
                          </div>

                          {module.short_description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">{module.short_description}</p>
                          )}
                          
                          {module.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{module.description}</p>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {module.usage_scenario && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('appDetails.usageScenario')}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{module.usage_scenario}</p>
                              </div>
                            )}

                            {module.cost && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  {t('appDetails.cost')}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{module.cost}</p>
                              </div>
                            )}
                          </div>
                          
                          {module.external_services && module.external_services.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('appDetails.externalServices')}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {module.external_services.slice(0, 3).map((service, i) => (
                                  <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                    {service.name}
                                  </span>
                                ))}
                                {module.external_services.length > 3 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{module.external_services.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {module.involved_actors && module.involved_actors.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('appDetails.involvedActors')}
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {module.involved_actors.slice(0, 4).map((actor, i) => (
                                  <span key={i} className="text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">{actor.name}</span>
                                    {actor.role && <span className="text-gray-500 dark:text-gray-500"> - {actor.role}</span>}
                                  </span>
                                ))}
                                {module.involved_actors.length > 4 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{module.involved_actors.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Pagination */}
            {totalModulePages > 1 && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentModulePage === 1}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalModulePages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentModulePage(page)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        page === currentModulePage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentModulePage === totalModulePages}
                  className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default AppDetails;