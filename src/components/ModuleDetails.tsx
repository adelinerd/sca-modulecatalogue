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
          return 'px-5 py-3'; // More horizontal padding for vertical images
        case 'landscape':
          return 'px-3 py-5'; // More vertical padding for horizontal images
        case 'square':
          return 'p-4'; // Equal padding for square images
        default:
          return 'p-3'; // Default padding while loading
      }
    } else {
      switch (orientation) {
        case 'portrait':
          return 'px-4 py-2'; // More horizontal padding for vertical images
        case 'landscape':
          return 'px-2 py-4'; // More vertical padding for horizontal images
        case 'square':
          return 'p-3'; // Equal padding for square images
        default:
          return 'p-2'; // Default padding while loading
      }
    }
  };

  return (
    <div className="flex-fill p-4 overflow-auto animate-fadeIn">
      <header className="mb-4">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center text-primary"
          >
            <ArrowLeft className="me-2" size={16} />
            {backToApp ? t('moduleDetails.backToApp', { appName: backToApp.name }) : t('moduleDetails.back')}
          </button>
        )}
        
        <h1 className="h2 fw-bold text-dark mb-2">{module.name}</h1>
        
        {/* App Name and Topic */}
        <div className="d-flex align-items-center gap-3 mb-2">
          {module.app_name && (
            <div className="d-flex align-items-center small text-muted">
              <Layers className="me-1" size={16} />
              <span>{t('moduleDetails.fromApp', { appName: module.app_name })}</span>
            </div>
          )}
          {module.topic && (
            <div className="small text-muted">
              {t('moduleDetails.topic')}: {module.topic}
            </div>
          )}
        </div>
        
        {module.short_description && (
          <p className="text-muted">{module.short_description}</p>
        )}
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Info className="me-2 text-primary" size={20} />
                {t('moduleDetails.overview')}
              </h2>
              
              {module.optional && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.optional')}
                  </h3>
                  <span className={`badge ${
                    module.optional === 'ja' || module.optional === 'yes'
                      ? 'text-bg-warning'
                      : 'text-bg-success'
                  }`}>
                    {module.optional}
                  </span>
                </div>
              )}
              
              {module.development_status && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.status')}
                  </h3>
                  <span className={`badge ${
                    module.development_status === 'Stable' 
                      ? 'text-bg-success' 
                      : module.development_status === 'Beta'
                        ? 'text-bg-warning'
                        : 'text-bg-info'
                  }`}>
                    {module.development_status}
                  </span>
                </div>
              )}
              
              {module.last_update && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.lastUpdate')}
                  </h3>
                  <div className="d-flex align-items-center">
                    <Calendar className="me-1 text-muted" size={16} />
                    <span className="small">{module.last_update}</span>
                  </div>
                </div>
              )}

              {module.cost && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.cost')}
                  </h3>
                  <p className="small">{module.cost}</p>
                </div>
              )}

              {module.opencode_repository && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.repository')}
                  </h3>
                  <a
                    href={module.opencode_repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none d-flex align-items-center"
                  >
                    <ExternalLink className="me-1" size={16} />
                    {t('moduleDetails.viewRepository')}
                  </a>
                </div>
              )}

              {module.technical_documentation && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('moduleDetails.documentation')}
                  </h3>
                  <a
                    href={module.technical_documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none d-flex align-items-center"
                  >
                    <ExternalLink className="me-1" size={16} />
                    {t('moduleDetails.viewDocumentation')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Wrench className="me-2 text-primary" size={20} />
                {t('moduleDetails.technical')}
              </h2>

              {module.interfaces && module.interfaces.length > 0 && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('moduleDetails.interfaces')}
                  </h3>
                  <div className="d-flex flex-wrap gap-1">
                    {module.interfaces.map((interface_, index) => (
                      <span 
                        key={index}
                        className="badge text-bg-info"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {interface_}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {module.dependencies && module.dependencies.length > 0 && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('moduleDetails.dependencies')}
                  </h3>
                  <div className="d-flex flex-wrap gap-1">
                    {module.dependencies.map((dependency, index) => (
                      <span 
                        key={index}
                        className="badge text-bg-secondary"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {dependency}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {module.deployed_in_municipalities && module.deployed_in_municipalities.length > 0 && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('moduleDetails.deployments')}
                  </h3>
                  <div className="d-flex flex-wrap gap-1">
                    {module.deployed_in_municipalities.map((municipality, index) => (
                      <span 
                        key={index}
                        className="badge text-bg-success"
                        style={{ fontSize: '0.75rem' }}
                      >
                        {municipality}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots Section - Only show if screenshots exist */}
      {hasScreenshots && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Package className="me-2 text-primary" size={20} />
                {t('moduleDetails.screenshots')}
              </h2>
              
              <div className="position-relative">
                {/* Main Gallery Image */}
                <div className="position-relative bg-light rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <div className={`w-100 h-100 d-flex align-items-center justify-content-center ${getImagePaddingClass(currentImageIndex)}`}>
                    <img
                      src={screenshots[currentImageIndex]}
                      alt={`${module.name} screenshot ${currentImageIndex + 1}`}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '100%', cursor: 'pointer' }}
                      onError={handleImageError}
                      onLoad={(e) => handleImageLoad(e, currentImageIndex)}
                      onClick={() => setIsLightboxOpen(true)}
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {screenshots.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-2 rounded-circle"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', zIndex: 10 }}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <button
                        onClick={handleNextImage}
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-2 rounded-circle"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', zIndex: 10 }}
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {screenshots.length > 1 && (
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                      <span className="badge text-bg-dark">
                        {currentImageIndex + 1} / {screenshots.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {screenshots.length > 1 && (
                  <div className="d-flex justify-content-center mt-3 gap-2 overflow-auto pb-2">
                    {screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`btn p-0 rounded overflow-hidden border-2 ${
                          index === currentImageIndex 
                            ? 'border-primary' 
                            : 'border-secondary'
                        }`}
                        style={{ width: '64px', height: '64px' }}
                      >
                        <img
                          src={screenshot}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-100 h-100 object-fit-cover"
                          onError={handleImageError}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1050 }} 
             onClick={() => setIsLightboxOpen(false)}>
          <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
            <div className={`w-100 h-100 d-flex align-items-center justify-content-center ${getImagePaddingClass(currentImageIndex, true)}`}>
              <img
                src={screenshots[currentImageIndex]}
                alt={`${module.name} screenshot ${currentImageIndex + 1}`}
                className="img-fluid"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={handleImageError}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="btn position-absolute top-0 end-0 mt-3 me-3 p-2 rounded-circle"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            
            {/* Navigation in Lightbox */}
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreviousImage();
                  }}
                  className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-3 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-3 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Image Counter in Lightbox */}
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <span className="badge text-bg-dark px-3 py-2">
                    {currentImageIndex + 1} / {screenshots.length}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {module.description && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">
                {t('moduleDetails.description')}
              </h2>
              <div className="text-muted lh-lg">
                {module.description.split('\n').map((paragraph, index) => {
                  // Handle empty lines as paragraph breaks
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  
                  // Handle markdown-style headers
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    const headerText = paragraph.slice(2, -2);
                    return (
                      <h3 key={index} className="h6 fw-semibold text-dark mt-4 mb-2">
                        {headerText}
                      </h3>
                    );
                  }
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const bulletText = paragraph.trim().slice(2);
                    return (
                      <li key={index} className="ms-3 mb-1">
                        {bulletText}
                      </li>
                    );
                  }
                  
                  // Handle indented bullet points (sub-items)
                  if (paragraph.trim().startsWith('  - ') || paragraph.trim().startsWith('  * ')) {
                    const bulletText = paragraph.trim().slice(2);
                    return (
                      <li key={index} className="ms-5 mb-1 small">
                        {bulletText}
                      </li>
                    );
                  }
                  
                  // Handle italic text (role descriptions)
                  if (paragraph.trim().startsWith('*') && paragraph.trim().endsWith('*') && !paragraph.startsWith('**')) {
                    const italicText = paragraph.trim().slice(1, -1);
                    return (
                      <p key={index} className="fst-italic text-muted mb-2 ms-3">
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
            </div>
          </div>
        </div>
      )}

      {module.usage_scenario && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">
                {t('moduleDetails.usageScenario')}
              </h2>
              <div className="text-muted lh-lg">
                {module.usage_scenario.split('\n').map((paragraph, index) => {
                  // Handle empty lines as paragraph breaks
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  
                  // Handle markdown-style headers
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    const headerText = paragraph.slice(2, -2);
                    return (
                      <h3 key={index} className="h6 fw-semibold text-dark mt-4 mb-2">
                        {headerText}
                      </h3>
                    );
                  }
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                    const bulletText = paragraph.trim().slice(2);
                    return (
                      <li key={index} className="ms-3 mb-1">
                        {bulletText}
                      </li>
                    );
                  }
                  
                  // Handle indented bullet points (sub-items)
                  if (paragraph.trim().startsWith('  - ') || paragraph.trim().startsWith('  * ')) {
                    const bulletText = paragraph.trim().slice(2);
                    return (
                      <li key={index} className="ms-5 mb-1 small">
                        {bulletText}
                      </li>
                    );
                  }
                  
                  // Handle italic text (role descriptions)
                  if (paragraph.trim().startsWith('*') && paragraph.trim().endsWith('*') && !paragraph.startsWith('**')) {
                    const italicText = paragraph.trim().slice(1, -1);
                    return (
                      <p key={index} className="fst-italic text-muted mb-2 ms-3">
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
            </div>
          </div>
        </div>
      )}

      {module.external_services && module.external_services.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3">
                {t('moduleDetails.externalServices')}
              </h2>
              <div className="d-flex flex-column gap-3">
                {module.external_services.map((service, index) => (
                  <div key={index} className="border rounded p-3">
                    <h3 className="h6 fw-medium mb-2">{service.name}</h3>
                    {service.description && (
                      <p className="small text-muted mb-2">{service.description}</p>
                    )}
                    {service.url && (
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small text-decoration-none d-flex align-items-center"
                      >
                        <ExternalLink className="me-1" size={12} />
                        {t('moduleDetails.learnMore')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {module.customization_options && module.customization_options.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Settings className="me-2 text-primary" size={20} />
                {t('moduleDetails.customizationOptions')}
              </h2>
              <ul className="list-unstyled">
                {module.customization_options.map((option, index) => (
                  <li key={index} className="small text-muted mb-1 d-flex align-items-start">
                    <span className="me-2">•</span>
                    <span>{option}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {module.involved_actors && module.involved_actors.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Users className="me-2 text-primary" size={20} />
                {t('moduleDetails.involvedActors')}
              </h2>
              <div className="d-flex flex-column gap-2">
                {module.involved_actors.map((actor, index) => (
                  <div key={index} className="border rounded p-2">
                    <div className="fw-medium">{actor.name}</div>
                    {actor.role && (
                      <div className="small text-muted">{actor.role}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Section */}
      {module.roadmap && module.roadmap.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <MapPin className="me-2 text-primary" size={20} />
                Roadmap
              </h2>
              <div className="d-flex flex-column gap-2">
                {module.roadmap.map((item, index) => (
                  <div key={index} className="d-flex align-items-start gap-3">
                    <div className="flex-shrink-0 rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center mt-1" 
                         style={{ width: '24px', height: '24px' }}>
                      <span className="small fw-medium text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-fill">
                      <p className="text-muted lh-base mb-0">
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetails;