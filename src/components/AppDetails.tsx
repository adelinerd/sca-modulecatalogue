/*
 * Modulbibliothek
 *
 * Copyright (c) 2026 Fraunhofer IESE, Adeline Silva Schäfer
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import React, { useState } from 'react';
import { CityApp, AppModule } from '../types';
import { ExternalLink, Calendar, Server, Info, Package, Phone, Mail, ChevronLeft, ChevronRight, Grid, List, Image, Smartphone, Globe, Monitor, Layers, Scale, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTopicLabel } from '../hooks/useTopicLabel';

interface AppDetailsProps {
  app: CityApp;
  onModuleClick?: (module: AppModule, fromApp: CityApp) => void;
}

// Helper component to display topic with translated label
const TopicBadge: React.FC<{ topic: string; floating?: boolean }> = ({ topic, floating }) => {
  const topicLabel = useTopicLabel(topic);
  if (floating) {
    return (
      <span
        className="position-absolute end-0 me-2 text-white fw-semibold py-1 px-3 rounded-pill shadow-sm"
        style={{
          top: '128px',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--bs-primary)',
          zIndex: 1,
          whiteSpace: 'nowrap',
          fontSize: '0.7rem',
        }}
      >
        {topicLabel}
      </span>
    );
  }
  return (
    <span className="badge text-bg-primary" style={{ fontSize: '0.7rem' }}>
      {topicLabel}
    </span>
  );
};

const AppDetails: React.FC<AppDetailsProps> = ({ app, onModuleClick }) => {
  const { t } = useTranslation();
  const [currentModulePage, setCurrentModulePage] = useState(1);
  const [moduleViewMode, setModuleViewMode] = useState<'grid' | 'list'>('grid');
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [isScreenshotLightboxOpen, setIsScreenshotLightboxOpen] = useState(false);
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

  const getFirstModuleScreenshot = (module: any): string | null => {
    if (!module.screenshots) return null;
    return Array.isArray(module.screenshots) ? module.screenshots[0] : module.screenshots;
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
    if (!appType) return <Package size={16} />;
    
    const type = appType.toLowerCase();
    if (type.includes('hybrid')) {
      return <Layers size={16} />;
    } else if (type.includes('native') || type.includes('mobile')) {
      return <Smartphone size={16} />;
    } else if (type.includes('web')) {
      return <Globe size={16} />;
    } else if (type.includes('desktop')) {
      return <Monitor size={16} />;
    }
    return <Package size={16} />;
  };

  const ModuleImageGallery: React.FC<{ module: any; className?: string; fixedHeight?: boolean }> = ({
    module,
    className = "",
    fixedHeight = true,
  }) => {
    const firstImage = getFirstModuleScreenshot(module);
    const [imageError, setImageError] = useState(false);
    return (
      <div className={`overflow-hidden ${className}`} style={{ height: fixedHeight ? '128px' : '100%', backgroundColor: '#f8f9fa' }}>
        {firstImage && !imageError ? (
          <img
            src={firstImage}
            alt={`${module.name} screenshot`}
            className="w-100 h-100 object-fit-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-subtle">
            <div className="text-center">
              <Image className="text-primary mb-1" size={24} />
              <p className="small text-primary fw-medium mb-0" style={{ fontSize: '0.7rem' }}>
                {t('moduleCard.noImage')}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-fill p-4 overflow-auto animate-fadeIn">
      <header className="mb-4">
        <div className="d-flex align-items-center mb-3">
          {app.logo?.url && (
            <img
              src={app.logo.url}
              alt={app.logo.description || `${app.name} logo`}
              className="me-3"
              style={{ width: '64px', height: '64px', objectFit: 'contain' }}
              onError={handleImageError}
            />
          )}
          <h1 className="h2 fw-bold mb-0">{app.name}</h1>
        </div>
        {app.provider && (
          <p className="small text-muted mb-2">
            {t('appCard.provider', { provider: app.provider })}
          </p>
        )}
        {app.short_description && (
          <p className="text-muted">{app.short_description}</p>
        )}
      </header>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Info className="me-2 text-primary" size={20} />
                {t('appDetails.overview')}
              </h2>
              
              {/* App Type */}
              {app.app_type && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.appType')}
                  </h3>
                  <div className="d-flex align-items-center">
                    <span className="me-2 text-muted">
                      {getAppTypeIcon(app.app_type)}
                    </span>
                    <span className="small">{app.app_type}</span>
                  </div>
                </div>
              )}
              
              {app.development_status && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.status')}
                  </h3>
                  <span className={`badge ${
                    app.development_status === 'Stable' 
                      ? 'text-bg-success' 
                      : app.development_status === 'Beta'
                        ? 'text-bg-warning'
                        : 'text-bg-info'
                  }`}>
                    {app.development_status}
                  </span>
                </div>
              )}
              
              {app.last_update && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.lastUpdate')}
                  </h3>
                  <div className="d-flex align-items-center">
                    <Calendar className="me-1 text-muted" size={16} />
                    <span className="small">{app.last_update}</span>
                  </div>
                </div>
              )}

              {app.contact && app.contact.length > 0 && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('appDetails.contact')}
                  </h3>
                  <div className="d-flex flex-column gap-2">
                    {app.contact.map((contact, index) => (
                      <div key={index} className="d-flex flex-column gap-1">
                        {contact.email && (
                          <a
                            href={contact.email.startsWith('http') ? contact.email : `mailto:${contact.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none d-flex align-items-center"
                          >
                            <Mail className="me-1" size={16} />
                            {contact.email.startsWith('http') ? t('appDetails.contactForm') : contact.email}
                          </a>
                        )}
                        {contact.telefon && (
                          <a
                            href={`tel:${contact.telefon}`}
                            className="small text-decoration-none d-flex align-items-center"
                          >
                            <Phone className="me-1" size={16} />
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
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('appDetails.developmentPartnership')}
                  </h3>
                  <div className="d-flex flex-column gap-2">
                    {app.development_partnership.map((partnership, index) => (
                      <div key={index} className="small">
                        <div className="fw-medium">{partnership.name}</div>
                        {partnership.kontakt && (
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{partnership.kontakt}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {app.documentation && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.documentation')}
                  </h3>
                  <a
                    href={app.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none d-flex align-items-center"
                  >
                    <ExternalLink className="me-1" size={16} />
                    {t('appDetails.viewDocumentation')}
                  </a>
                </div>
              )}

              {app.website && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.website')}
                  </h3>
                  <a
                    href={app.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none d-flex align-items-center"
                  >
                    <ExternalLink className="me-1" size={16} />
                    {t('appDetails.visitWebsite')}
                  </a>
                </div>
              )}

              {app.opencode_repository && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    {t('appDetails.repository')}
                  </h3>
                  <a
                    href={app.opencode_repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="small text-decoration-none d-flex align-items-center"
                  >
                    <ExternalLink className="me-1" size={16} />
                    {t('appDetails.viewRepository')}
                  </a>
                </div>
              )}

              {app.license && (
                <div className="mb-3">
                  <h3 className="small fw-medium text-muted mb-1">
                    License
                  </h3>
                  <div className="d-flex align-items-start">
                    <Scale className="me-2 text-muted flex-shrink-0 mt-1" size={16} />
                    <div>
                      <div className="small fw-medium">
                        {app.license.name}
                      </div>
                      {app.license.url && (
                        <a
                          href={app.license.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small text-decoration-none d-flex align-items-center mt-1"
                        >
                          <ExternalLink className="me-1" size={12} />
                          View License
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5 mb-3 d-flex align-items-center">
                  <Server className="me-2 text-primary" size={20} />
                  {t('appDetails.deployments')}
                </h2>
                <div>
                  <h3 className="small fw-medium text-muted mb-2">
                    {t('compareView.deployments.title')}
                  </h3>
                  <div className="d-flex flex-wrap gap-2">
                    {app.deployed_in_municipalities.map((municipality, index) => (
                      <span 
                        key={index}
                        className="badge text-bg-secondary"
                      >
                        {municipality}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Screenshots Section */}
      {app.screenshots && app.screenshots.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 d-flex align-items-center">
                <Image className="me-2 text-primary" size={20} />
                Screenshots
              </h2>
              
              <div className="position-relative">
                {/* Main Screenshot Display */}
                <div className="position-relative bg-body-secondary rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center p-3">
                    <img
                      src={app.screenshots[currentScreenshotIndex].url}
                      alt={app.screenshots[currentScreenshotIndex].description || `Screenshot ${currentScreenshotIndex + 1}`}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '100%', cursor: 'pointer' }}
                      onError={handleImageError}
                      onClick={() => setIsScreenshotLightboxOpen(true)}
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {app.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentScreenshotIndex(prev => prev === 0 ? app.screenshots!.length - 1 : prev - 1)}
                        className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-2 rounded-circle"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', zIndex: 10 }}
                        aria-label="Previous screenshot"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <button
                        onClick={() => setCurrentScreenshotIndex(prev => prev === app.screenshots!.length - 1 ? 0 : prev + 1)}
                        className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-2 rounded-circle"
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', zIndex: 10 }}
                        aria-label="Next screenshot"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  
                  {/* Screenshot Counter */}
                  {app.screenshots.length > 1 && (
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                      <span className="badge text-bg-dark">
                        {currentScreenshotIndex + 1} / {app.screenshots.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Screenshot Description */}
                {app.screenshots[currentScreenshotIndex].description && (
                  <p className="small text-muted mt-2 text-center">
                    {app.screenshots[currentScreenshotIndex].description}
                  </p>
                )}
                
                {/* Thumbnail Navigation */}
                {app.screenshots.length > 1 && (
                  <div className="d-flex justify-content-center mt-3 gap-2 overflow-auto pb-2">
                    {app.screenshots.map((screenshot, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentScreenshotIndex(index)}
                        className={`btn p-0 rounded overflow-hidden border-2 ${
                          index === currentScreenshotIndex 
                            ? 'border-primary' 
                            : 'border-secondary'
                        }`}
                        style={{ width: '64px', height: '64px' }}
                      >
                        <img
                          src={screenshot.url}
                          alt={screenshot.description || `Thumbnail ${index + 1}`}
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

      {/* Screenshot Lightbox */}
      {isScreenshotLightboxOpen && app.screenshots && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1050 }} 
             onClick={() => setIsScreenshotLightboxOpen(false)}>
          <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
            <div className="w-100 h-100 d-flex align-items-center justify-content-center p-4">
              <img
                src={app.screenshots[currentScreenshotIndex].url}
                alt={app.screenshots[currentScreenshotIndex].description || `Screenshot ${currentScreenshotIndex + 1}`}
                className="img-fluid"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onError={handleImageError}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsScreenshotLightboxOpen(false)}
              className="btn position-absolute top-0 end-0 mt-3 me-3 p-2 rounded-circle"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            
            {/* Navigation in Lightbox */}
            {app.screenshots.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreenshotIndex(prev => prev === 0 ? app.screenshots!.length - 1 : prev - 1);
                  }}
                  className="btn position-absolute top-50 start-0 translate-middle-y ms-3 p-3 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Previous screenshot"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentScreenshotIndex(prev => prev === app.screenshots!.length - 1 ? 0 : prev + 1);
                  }}
                  className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-3 rounded-circle"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: 'none', color: 'white' }}
                  aria-label="Next screenshot"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Screenshot Counter in Lightbox */}
                <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3">
                  <span className="badge text-bg-dark px-3 py-2">
                    {currentScreenshotIndex + 1} / {app.screenshots.length}
                  </span>
                </div>
              </>
            )}
            
            {/* Description in Lightbox */}
            {app.screenshots[currentScreenshotIndex].description && (
              <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5 px-3 py-2 rounded text-center" 
                   style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', maxWidth: '400px' }}>
                {app.screenshots[currentScreenshotIndex].description}
              </div>
            )}
          </div>
        </div>
      )}

      {modules.length > 0 && (
        <div className="mt-4">
          <div className="card shadow-sm">
            {/* Module Header */}
            <div className="card-header bg-body-secondary">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="h5 mb-0 d-flex align-items-center">
                  <Package className="me-2 text-primary" size={20} />
                  {t('appDetails.modules')} ({modules.length})
                </h2>
                
                <div className="d-flex align-items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="btn-group" role="group">
                    <button
                      onClick={() => setModuleViewMode('grid')}
                      className={`btn btn-sm ${
                        moduleViewMode === 'grid'
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      title="Grid view"
                    >
                      <Grid size={16} />
                    </button>
                    <button
                      onClick={() => setModuleViewMode('list')}
                      className={`btn btn-sm ${
                        moduleViewMode === 'list'
                          ? 'btn-primary'
                          : 'btn-outline-secondary'
                      }`}
                      title="List view"
                    >
                      <List size={16} />
                    </button>
                  </div>

                  {/* Pagination Controls */}
                  {totalModulePages > 1 && (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentModulePage === 1}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      
                      <span className="small text-muted px-2">
                        {currentModulePage} / {totalModulePages}
                      </span>
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentModulePage === totalModulePages}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="card-body">
              {moduleViewMode === 'grid' ? (
                <div className="row g-3">
                  {currentModules.map((module, index) => {
                    const moduleKey = `${startIndex + index}-${module.name}`;
                    return (
                      <div key={moduleKey} className="col-12 col-md-6 col-xl-4">
                        <div
                          className="card h-100 border hover-shadow position-relative"
                          style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                          onClick={() => handleModuleCardClick(module)}
                        >
                          <ModuleImageGallery module={module} className="border-bottom" />

                          {/* Floating topic pill */}
                          {module.topic && (
                            <TopicBadge
                              topic={module.topic}
                              floating
                            />
                          )}

                          <div className="card-body p-3">
                            <div className="d-flex align-items-start justify-content-between mb-2">
                              <h3 className="h6 mb-0 flex-fill line-clamp-2">{module.name}</h3>
                              {module.development_status && (
                                <span className={`badge ms-2 ${
                                  module.development_status === 'Stable'
                                    ? 'text-bg-success'
                                    : module.development_status === 'Beta'
                                      ? 'text-bg-warning'
                                      : 'text-bg-info'
                                }`} style={{ fontSize: '0.7rem' }}>
                                  {module.development_status}
                                </span>
                              )}
                            </div>

                            {module.short_description && (
                              <p className="small text-muted mb-2 fw-medium line-clamp-3">{module.short_description}</p>
                            )}
                            
                            {/* Quick Info */}
                            <div className="d-flex flex-column gap-1" style={{ fontSize: '0.75rem' }}>
                              {module.cost && (
                                <div className="d-flex align-items-center text-muted">
                                  <span className="fw-medium me-1">{t('appDetails.cost')}:</span>
                                  <span className="text-truncate">{module.cost}</span>
                                </div>
                              )}
                              
                              {module.optional && (
                                <div>
                                  <span className="badge text-bg-warning" style={{ fontSize: '0.65rem' }}>
                                    {t('appDetails.optional')}: {module.optional}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {currentModules.map((module, index) => {
                    const moduleKey = `${startIndex + index}-${module.name}`;
                    return (
                      <div 
                        key={moduleKey}
                        className="card border hover-shadow"
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handleModuleCardClick(module)}
                      >
                        <div className="row g-0">
                          {/* Module Image - Left Side */}
                          <div className="col-auto position-relative" style={{ width: '192px' }}>
                            <ModuleImageGallery module={module} className="border-end" fixedHeight={false} />
                            {module.topic && (
                              <TopicBadge topic={module.topic} floating />
                            )}
                          </div>

                          {/* Module Content - Right Side */}
                          <div className="col">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-start justify-content-between mb-2">
                                <h3 className="h6 mb-0">{module.name}</h3>
                                {module.development_status && (
                                  <span className={`badge ${
                                    module.development_status === 'Stable'
                                      ? 'text-bg-success'
                                      : module.development_status === 'Beta'
                                        ? 'text-bg-warning'
                                        : 'text-bg-info'
                                  }`} style={{ fontSize: '0.7rem' }}>
                                    {module.development_status}
                                  </span>
                                )}
                              </div>

                              <div className="d-flex flex-wrap gap-2 mb-2">
                                {module.optional && (
                                  <span className="badge text-bg-warning" style={{ fontSize: '0.7rem' }}>
                                    {t('appDetails.optional')}: {module.optional}
                                  </span>
                                )}
                              </div>

                              {module.short_description && (
                                <p className="small text-muted mb-2 fw-medium">{module.short_description}</p>
                              )}
                              
                              <div className="row g-3 small">
                                {module.usage_scenario && (
                                  <div className="col-12 col-md-6">
                                    <h4 className="small fw-medium text-muted mb-1">
                                      {t('appDetails.usageScenario')}
                                    </h4>
                                    <p className="small text-muted">{module.usage_scenario}</p>
                                  </div>
                                )}

                                {module.cost && (
                                  <div className="col-12 col-md-6">
                                    <h4 className="small fw-medium text-muted mb-1">
                                      {t('appDetails.cost')}
                                    </h4>
                                    <p className="small text-muted">{module.cost}</p>
                                  </div>
                                )}
                              </div>
                              
                              {module.external_services && module.external_services.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="small fw-medium text-muted mb-1">
                                    {t('appDetails.externalServices')}
                                  </h4>
                                  <div className="d-flex flex-wrap gap-1">
                                    {module.external_services.slice(0, 3).map((service, i) => (
                                      <span key={i} className="badge text-bg-secondary" style={{ fontSize: '0.7rem' }}>
                                        {service.name}
                                      </span>
                                    ))}
                                    {module.external_services.length > 3 && (
                                      <span className="small text-muted">
                                        +{module.external_services.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {module.involved_actors && module.involved_actors.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="small fw-medium text-muted mb-1">
                                    {t('appDetails.involvedActors')}
                                  </h4>
                                  <div className="d-flex flex-wrap gap-2">
                                    {module.involved_actors.slice(0, 4).map((actor, i) => (
                                      <span key={i} className="small text-muted">
                                        <span className="fw-medium">{actor.name}</span>
                                        {actor.role && <span className="text-muted"> - {actor.role}</span>}
                                      </span>
                                    ))}
                                    {module.involved_actors.length > 4 && (
                                      <span className="small text-muted">
                                        +{module.involved_actors.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bottom Pagination */}
              {totalModulePages > 1 && (
                <div className="d-flex align-items-center justify-content-center mt-4 gap-2">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentModulePage === 1}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Previous
                  </button>
                  
                  <div className="d-flex gap-1">
                    {Array.from({ length: totalModulePages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentModulePage(page)}
                        className={`btn btn-sm ${
                          page === currentModulePage
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentModulePage === totalModulePages}
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppDetails;