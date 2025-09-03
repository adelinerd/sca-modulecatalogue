import React, { useState } from 'react';
import { AppModule, CityApp } from '../types';
import { ExternalLink, Calendar, Package, Info, Phone, Mail, Users, Settings, Wrench, ArrowLeft, ChevronLeft, ChevronRight, X, Layers, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleDetailsProps {
  module: AppModule;
  onBack?: () => void;
  showBackButton?: boolean;
  backToApp?: CityApp;
}

const ModuleDetails: React.FC<ModuleDetailsProps> = ({ 
  module, 
  onBack, 
  showBackButton = false, 
  backToApp 
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageAspectRatios, setImageAspectRatios] = useState<{[key: number]: 'portrait' | 'landscape' | 'square'}>({});
  
  if (!module) return null;

  // Handle screenshots - can be string or array
  const screenshots = Array.isArray(module.screenshots) 
    ? module.screenshots 
    : module.screenshots 
      ? [module.screenshots] 
      : [];

  const hasScreenshots = screenshots.length > 0;

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? screenshots.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev === screenshots.length - 1 ? 0 : prev + 1);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    let orientation: 'portrait' | 'landscape' | 'square';
    if (aspectRatio > 1.2) {
      orientation = 'landscape';
    } else if (aspectRatio < 0.8) {
      orientation = 'portrait';
    } else {
      orientation = 'square';
    }
    
    setImageAspectRatios(prev => ({
      ...prev,
      [index]: orientation
    }));
  };

  const getImagePaddingClass = (index: number, isLightbox = false) => {
    const orientation = imageAspectRatios[index];
    
    if (isLightbox) {
      switch (orientation) {
        case 'portrait':
          return 'px-20 py-8'; // More horizontal padding for vertical images
        case 'landscape':
          return 'px-8 py-16'; // More vertical padding for horizontal images
        case 'square':
          return 'p-12'; // Equal padding for square images
        default:
          return 'p-8'; // Default padding while loading
      }
    } else {
      switch (orientation) {
        case 'portrait':
          return 'px-16 py-4'; // More horizontal padding for vertical images
        case 'landscape':
          return 'px-4 py-8'; // More vertical padding for horizontal images
        case 'square':
          return 'p-6'; // Equal padding for square images
        default:
          return 'p-4'; // Default padding while loading
      }
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto animate-fadeIn">
      <header className="mb-6">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4 transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backToApp ? t('moduleDetails.backToApp', { appName: backToApp.name }) : t('moduleDetails.back')}
          </button>
        )}
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{module.name}</h1>
        
        {/* App Name and Topic */}
        <div className="flex items-center space-x-4 mt-2">
          {module.app_name && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Layers className="h-4 w-4 mr-1" />
              <span>{t('moduleDetails.fromApp', { appName: module.app_name })}</span>
            </div>
          )}
          {module.topic && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('moduleDetails.topic')}: {module.topic}
            </div>
          )}
        </div>
        
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

      {/* Screenshots Section - Only show if screenshots exist */}
      {hasScreenshots && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            {t('moduleDetails.screenshots')}
          </h2>
          
          <div className="relative">
            {/* Main Gallery Image */}
            <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <div className={`w-full h-full flex items-center justify-center ${getImagePaddingClass(currentImageIndex)}`}>
                <img
                  src={screenshots[currentImageIndex]}
                  alt={`${module.name} screenshot ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain shadow-lg rounded"
                  onError={handleImageError}
                  onLoad={(e) => handleImageLoad(e, currentImageIndex)}
                  onClick={() => setIsLightboxOpen(true)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              
              {/* Navigation Arrows */}
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {screenshots.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {screenshots.length}
                </div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            {screenshots.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-blue-500' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={screenshot}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            <div className={`w-full h-full flex items-center justify-center ${getImagePaddingClass(currentImageIndex, true)}`}>
              <img
                src={screenshots[currentImageIndex]}
                alt={`${module.name} screenshot ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onError={handleImageError}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Navigation in Lightbox */}
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                {/* Image Counter in Lightbox */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {screenshots.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {module.description && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            {t('moduleDetails.description')}
          </h2>
          <div className="text-gray-600 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            {module.description.split('\n').map((paragraph, index) => {
              // Handle empty lines as paragraph breaks
              if (paragraph.trim() === '') {
                return <br key={index} />;
              }
              
              // Handle markdown-style headers
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const headerText = paragraph.slice(2, -2);
                return (
                  <h3 key={index} className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">
                    {headerText}
                  </h3>
                );
              }
              
              // Handle bullet points
              if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                const bulletText = paragraph.trim().slice(2);
                return (
                  <li key={index} className="ml-4 mb-1 list-disc">
                    {bulletText}
                  </li>
                );
              }
              
              // Handle indented bullet points (sub-items)
              if (paragraph.trim().startsWith('  - ') || paragraph.trim().startsWith('  * ')) {
                const bulletText = paragraph.trim().slice(2);
                return (
                  <li key={index} className="ml-8 mb-1 list-disc text-sm">
                    {bulletText}
                  </li>
                );
              }
              
              // Handle italic text (role descriptions)
              if (paragraph.trim().startsWith('*') && paragraph.trim().endsWith('*') && !paragraph.startsWith('**')) {
                const italicText = paragraph.trim().slice(1, -1);
                return (
                  <p key={index} className="italic text-gray-500 dark:text-gray-400 mb-2 ml-4">
                    {italicText}
                  </p>
                );
              }
              
              // Regular paragraphs
              return (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              );
            })}
          </div>
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

      {/* Roadmap Section */}
      {module.roadmap && module.roadmap.length > 0 && (
        <section className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-500" />
            Roadmap
          </h2>
          <div className="space-y-3">
            {module.roadmap.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ModuleDetails;