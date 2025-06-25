import React, { useState } from 'react';
import { AppModule } from '../types';
import { Package, ChevronLeft, ChevronRight, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleCardProps {
  module: AppModule;
  onClick: () => void;
  isSelected: boolean;
  onToggleCompare: () => void;
  isInCompareList: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  module, 
  onClick, 
  isSelected, 
  onToggleCompare, 
  isInCompareList 
}) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Handle screenshots - can be string or array
  const screenshots = Array.isArray(module.screenshots) 
    ? module.screenshots 
    : module.screenshots 
      ? [module.screenshots] 
      : [];

  const hasImages = screenshots.length > 0;
  const showNavigation = screenshots.length > 1;

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? screenshots.length - 1 : prev - 1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === screenshots.length - 1 ? 0 : prev + 1);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Hide the image if it fails to load
    e.currentTarget.style.display = 'none';
  };

  return (
    <div 
      className={`
        relative rounded-lg transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected 
          ? 'bg-primary-50 dark:bg-primary-900 border-2 border-primary-500'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent'
        }
        shadow-sm hover:shadow-md
      `}
      onClick={onClick}
    >
      {/* Image Gallery Section */}
      <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {hasImages ? (
          <>
            <img
              src={screenshots[currentImageIndex]}
              alt={`${module.name} screenshot ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={handleImageError}
            />
            
            {/* Image Navigation */}
            {showNavigation && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Placeholder when no images
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900">
            <div className="text-center">
              <Image className="h-12 w-12 text-primary-400 dark:text-primary-500 mx-auto mb-2" />
              <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                {t('moduleCard.noImage')}
              </p>
            </div>
          </div>
        )}
        
        {/* Image Count Badge */}
        {hasImages && screenshots.length > 1 && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{screenshots.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center flex-1 min-w-0">
            <div className="bg-primary-50 dark:bg-primary-900 p-2 rounded-lg flex-shrink-0">
              <Package className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50 truncate">
                {module.name}
              </h3>
              {module.topic && (
                <p className="text-sm text-primary-600 dark:text-primary-400 truncate">
                  {module.topic}
                </p>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`
              text-xs px-3 py-1 rounded-full flex-shrink-0 ml-2
              ${isInCompareList 
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
                : 'bg-gray-100 text-primary-600 dark:bg-gray-700 dark:text-primary-300 hover:bg-teal-50 dark:hover:bg-teal-900/50'}
              transition-colors duration-200
            `}
          >
            {isInCompareList ? t('moduleCard.selected') : t('moduleCard.compare')}
          </button>
        </div>

        {module.short_description && (
          <p className="text-xs text-primary-500 dark:text-primary-400 mb-3 line-clamp-2">
            {module.short_description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {module.optional && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
              {t('moduleCard.optional')}: {module.optional}
            </span>
          )}
          
          {module.development_status && (
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${module.development_status === 'Stable' 
                ? 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300' 
                : module.development_status === 'Beta'
                  ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
                  : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
              }
            `}>
              {module.development_status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;