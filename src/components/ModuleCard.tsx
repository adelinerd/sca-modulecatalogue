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
    e.currentTarget.style.display = 'none';
  };

  return (
    <div 
      className={`
        card position-relative cursor-pointer overflow-hidden transition-all
        ${isSelected 
          ? 'bg-primary-subtle border-primary border-2 shadow-sm' 
          : 'hover-shadow border-2 border-transparent'
        }
      `}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Gallery Section */}
      <div className="position-relative overflow-hidden" style={{ height: '192px', backgroundColor: '#f8f9fa' }}>
        {hasImages ? (
          <>
            <img
              src={screenshots[currentImageIndex]}
              alt={`${module.name} screenshot ${currentImageIndex + 1}`}
              className="w-100 h-100 object-fit-cover"
              style={{ transition: 'opacity 0.3s' }}
              onError={handleImageError}
            />
            
            {/* Image Navigation */}
            {showNavigation && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="btn btn-sm position-absolute top-50 start-0 translate-middle-y ms-2 p-1 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <button
                  onClick={handleNextImage}
                  className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 p-1 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Next image"
                >
                  <ChevronRight size={16} />
                </button>
                
                {/* Image Indicators */}
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                  {screenshots.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`btn p-0 rounded-circle ${
                        index === currentImageIndex 
                          ? 'bg-body' 
                          : 'bg-body bg-opacity-50'
                      }`}
                      style={{ width: '8px', height: '8px', border: 'none' }}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Placeholder when no images
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-subtle">
            <div className="text-center">
              <Image className="text-primary mb-2" size={48} />
              <p className="small text-primary fw-medium mb-0">
                {t('moduleCard.noImage')}
              </p>
            </div>
          </div>
        )}
        
        {/* Image Count Badge */}
        {hasImages && screenshots.length > 1 && (
          <div className="position-absolute top-0 start-0 mt-2 ms-2">
            <span className="badge text-bg-dark small">
              {currentImageIndex + 1}/{screenshots.length}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center flex-grow-1 min-width-0">
            <div className="bg-primary-subtle p-2 rounded flex-shrink-0">
              <Package className="text-primary" size={20} />
            </div>
            <div className="ms-3 min-width-0 flex-grow-1">
              <h5 className="card-title mb-1 text-truncate">
                {module.name}
              </h5>
              <div className="d-flex align-items-center gap-2 small text-muted">
                {module.app_name && (
                  <span className="text-truncate">
                    {t('moduleCard.fromApp', { appName: module.app_name })}
                  </span>
                )}
                {module.topic && module.app_name && (
                  <span>•</span>
                )}
                {module.topic && (
                  <span className="text-truncate">{module.topic}</span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`
              btn btn-sm rounded-pill flex-shrink-0 ms-2
              ${isInCompareList 
                ? 'btn-success' 
                : 'btn-outline-secondary'}
            `}
            style={{ fontSize: '0.75rem' }}
          >
            {isInCompareList ? t('moduleCard.selected') : t('moduleCard.compare')}
          </button>
        </div>

        {module.short_description && (
          <p className="card-text small text-muted mb-3 line-clamp-2">
            {module.short_description}
          </p>
        )}
        
        <div className="d-flex align-items-center justify-content-between">
          {module.optional && (
            <span className="badge text-bg-warning small">
              {t('moduleCard.optional')}: {module.optional}
            </span>
          )}
          
          {module.development_status && (
            <span className={`
              badge small
              ${module.development_status === 'Stable' 
                ? 'text-bg-success' 
                : module.development_status === 'Beta'
                  ? 'text-bg-info'
                  : 'text-bg-primary'
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