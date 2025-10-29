import React from 'react';
import { CityApp } from '../types';
import { X, Calendar, Server, ExternalLink, Package, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CompareViewProps {
  apps: CityApp[];
  onClose: () => void;
  onRemoveApp: (app: CityApp) => void;
}

const CompareView: React.FC<CompareViewProps> = ({ apps, onClose, onRemoveApp }) => {
  const { t } = useTranslation();

  if (apps.length === 0) {
    return (
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-body">
        <div className="text-center p-4">
          <AlertCircle className="text-primary mb-3" size={48} />
          <h3 className="h5 mb-2">
            {t('compareView.empty.title')}
          </h3>
          <p className="text-muted">
            {t('compareView.empty.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 h-100 overflow-auto animate-fadeIn">
      <header className="sticky-top bg-body border-bottom p-3 d-flex align-items-center justify-content-between">
        <h2 className="h4 mb-0">
          {t('compareView.title', { count: apps.length })}
        </h2>
        <button
          onClick={onClose}
          className="btn btn-outline-secondary btn-sm rounded-circle p-2"
          aria-label="Close comparison view"
        >
          <X size={16} />
        </button>
      </header>

      <div className="p-4">
        <div className="row g-4">
          {apps.map((app) => (
            <div key={app.name} className="col-12 col-md-6">
              <div className="position-relative">
                <button
                  onClick={() => onRemoveApp(app)}
                  className="btn btn-sm btn-outline-danger rounded-circle p-1 position-absolute top-0 end-0 mt-2 me-2"
                  style={{ zIndex: 10 }}
                  aria-label={`Remove ${app.name} from comparison`}
                >
                  <X size={14} />
                </button>
                
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary-subtle">
                    <h3 className="h5 mb-1">{app.name}</h3>
                    {app.provider && (
                      <p className="small text-muted mb-1">{t('appCard.provider', { provider: app.provider })}</p>
                    )}
                    {app.short_description && (
                      <p className="small text-muted mb-0">{app.short_description}</p>
                    )}
                  </div>
                  
                  <div className="card-body">
                    {/* Basic Information */}
                    <div className="mb-4">
                      <h4 className="h6 mb-3 d-flex align-items-center">
                        <Calendar className="me-2 text-primary" size={16} />
                        {t('compareView.details.title')}
                      </h4>
                      <div className="row g-2 small">
                        <div className="col-6">
                          <dt className="text-muted">{t('compareView.details.status')}</dt>
                          <dd className=" mb-2">
                            {app.development_status || t('compareView.details.notSpecified')}
                          </dd>
                        </div>
                        <div className="col-6">
                          <dt className="text-muted">{t('compareView.details.lastUpdate')}</dt>
                          <dd className=" mb-2">
                            {app.last_update || t('compareView.details.notSpecified')}
                          </dd>
                        </div>
                      </div>
                    </div>
                    
                    {/* Links */}
                    <div className="mb-4">
                      <h4 className="h6 mb-3 d-flex align-items-center">
                        <ExternalLink className="me-2 text-primary" size={16} />
                        {t('compareView.resources.title')}
                      </h4>
                      <div className="d-flex flex-column gap-2">
                        {app.documentation && (
                          <a
                            href={app.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none"
                          >
                            {t('compareView.resources.documentation')}
                          </a>
                        )}
                        {app.website && (
                          <a
                            href={app.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none"
                          >
                            {t('compareView.resources.website')}
                          </a>
                        )}
                        {app.opencode_repository && (
                          <a
                            href={app.opencode_repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none"
                          >
                            {t('compareView.resources.repository')}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Deployments */}
                    {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Server className="me-2 text-primary" size={16} />
                          {t('compareView.deployments.title')}
                        </h4>
                        <div className="d-flex flex-wrap gap-1">
                          {app.deployed_in_municipalities.map((municipality, index) => (
                            <span 
                              key={index}
                              className="badge text-bg-secondary small"
                            >
                              {municipality}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Modules */}
                    {app.modules && app.modules.length > 0 && (
                      <div>
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Package className="me-2 text-primary" size={16} />
                          {t('compareView.modules.title', { count: app.modules.length })}
                        </h4>
                        <div className="d-flex flex-column gap-2">
                          {app.modules.map((module, index) => (
                            <div 
                              key={index}
                              className="border rounded p-2"
                            >
                              <div className="fw-medium small mb-1">
                                {module.name}
                              </div>
                              {module.topic && (
                                <span className="badge text-bg-info small me-2">
                                  {module.topic}
                                </span>
                              )}
                              {module.short_description && (
                                <p className="small text-muted mb-1 fw-medium line-clamp-2">
                                  {module.short_description}
                                </p>
                              )}
                              {module.description && (
                                <p className="small text-muted mb-0 line-clamp-3">
                                  {module.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareView;