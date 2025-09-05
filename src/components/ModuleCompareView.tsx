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
      <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center p-4">
          <AlertCircle className="text-primary mb-3" size={48} />
          <h3 className="h5 text-dark mb-2">
            {t('moduleCompareView.empty.title')}
          </h3>
          <p className="text-muted">
            {t('moduleCompareView.empty.description')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-100 h-100 overflow-auto animate-fadeIn">
      <header className="sticky-top bg-white border-bottom p-3 d-flex align-items-center justify-content-between">
        <h2 className="h4 mb-0 text-dark">
          {t('moduleCompareView.title', { count: modules.length })}
        </h2>
        <button
          onClick={onClose}
          className="btn btn-outline-secondary btn-sm rounded-circle p-2"
          aria-label="Close module comparison view"
        >
          <X size={16} />
        </button>
      </header>

      <div className="p-4">
        <div className="row g-4">
          {modules.map((module, index) => (
            <div key={`${module.name}-${index}`} className="col-12 col-md-6">
              <div className="position-relative">
                <button
                  onClick={() => onRemoveModule(module)}
                  className="btn btn-sm btn-outline-danger rounded-circle p-1 position-absolute top-0 end-0 mt-2 me-2"
                  style={{ zIndex: 10 }}
                  aria-label={`Remove ${module.name} from comparison`}
                >
                  <X size={14} />
                </button>
                
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary-subtle">
                    <h3 className="h5 mb-1 text-dark">{module.name}</h3>
                    {module.topic && (
                      <p className="small text-muted mb-1">{module.topic}</p>
                    )}
                    {module.short_description && (
                      <p className="small text-muted mb-0">{module.short_description}</p>
                    )}
                  </div>
                  
                  <div className="card-body">
                    {/* Basic Information */}
                    <div className="mb-4">
                      <h4 className="h6 mb-3 d-flex align-items-center">
                        <Calendar className="me-2 text-primary" size={16} />
                        {t('moduleCompareView.details.title')}
                      </h4>
                      <div className="row g-2 small">
                        <div className="col-6">
                          <dt className="text-muted">{t('moduleCompareView.details.status')}</dt>
                          <dd className="text-dark mb-2">
                            {module.development_status || t('moduleCompareView.details.notSpecified')}
                          </dd>
                        </div>
                        <div className="col-6">
                          <dt className="text-muted">{t('moduleCompareView.details.lastUpdate')}</dt>
                          <dd className="text-dark mb-2">
                            {module.last_update || t('moduleCompareView.details.notSpecified')}
                          </dd>
                        </div>
                        <div className="col-6">
                          <dt className="text-muted">{t('moduleCompareView.details.optional')}</dt>
                          <dd className="text-dark mb-2">
                            {module.optional || t('moduleCompareView.details.notSpecified')}
                          </dd>
                        </div>
                        <div className="col-6">
                          <dt className="text-muted">{t('moduleCompareView.details.cost')}</dt>
                          <dd className="text-dark mb-2">
                            {module.cost || t('moduleCompareView.details.notSpecified')}
                          </dd>
                        </div>
                      </div>
                    </div>
                    
                    {/* Technical Details */}
                    {(module.interfaces?.length || module.dependencies?.length) && (
                      <div className="mb-4">
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Wrench className="me-2 text-primary" size={16} />
                          {t('moduleCompareView.technical.title')}
                        </h4>
                        <div className="d-flex flex-column gap-2">
                          {module.interfaces && module.interfaces.length > 0 && (
                            <div>
                              <dt className="small text-muted mb-1">
                                {t('moduleCompareView.technical.interfaces')}
                              </dt>
                              <div className="d-flex flex-wrap gap-1">
                                {module.interfaces.slice(0, 3).map((interface_, i) => (
                                  <span key={i} className="badge text-bg-info small">
                                    {interface_}
                                  </span>
                                ))}
                                {module.interfaces.length > 3 && (
                                  <span className="small text-muted">
                                    +{module.interfaces.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {module.dependencies && module.dependencies.length > 0 && (
                            <div>
                              <dt className="small text-muted mb-1">
                                {t('moduleCompareView.technical.dependencies')}
                              </dt>
                              <div className="d-flex flex-wrap gap-1">
                                {module.dependencies.slice(0, 3).map((dep, i) => (
                                  <span key={i} className="badge text-bg-secondary small">
                                    {dep}
                                  </span>
                                ))}
                                {module.dependencies.length > 3 && (
                                  <span className="small text-muted">
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
                    <div className="mb-4">
                      <h4 className="h6 mb-3 d-flex align-items-center">
                        <ExternalLink className="me-2 text-primary" size={16} />
                        {t('moduleCompareView.resources.title')}
                      </h4>
                      <div className="d-flex flex-column gap-2">
                        {module.technical_documentation && (
                          <a
                            href={module.technical_documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none"
                          >
                            {t('moduleCompareView.resources.documentation')}
                          </a>
                        )}
                        {module.opencode_repository && (
                          <a
                            href={module.opencode_repository}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="small text-decoration-none"
                          >
                            {t('moduleCompareView.resources.repository')}
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Deployments */}
                    {module.deployed_in_municipalities && module.deployed_in_municipalities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Package className="me-2 text-primary" size={16} />
                          {t('moduleCompareView.deployments.title')}
                        </h4>
                        <div className="d-flex flex-wrap gap-1">
                          {module.deployed_in_municipalities.slice(0, 4).map((municipality, index) => (
                            <span 
                              key={index}
                              className="badge text-bg-secondary small"
                            >
                              {municipality}
                            </span>
                          ))}
                          {module.deployed_in_municipalities.length > 4 && (
                            <span className="small text-muted">
                              +{module.deployed_in_municipalities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* External Services */}
                    {module.external_services && module.external_services.length > 0 && (
                      <div className="mb-4">
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Settings className="me-2 text-primary" size={16} />
                          {t('moduleCompareView.externalServices.title')} ({module.external_services.length})
                        </h4>
                        <div className="d-flex flex-column gap-2">
                          {module.external_services.slice(0, 3).map((service, index) => (
                            <div 
                              key={index}
                              className="border rounded p-2"
                            >
                              <div className="fw-medium text-dark small">
                                {service.name}
                              </div>
                              {service.description && (
                                <p className="small text-muted mb-0 line-clamp-2">
                                  {service.description}
                                </p>
                              )}
                            </div>
                          ))}
                          {module.external_services.length > 3 && (
                            <p className="small text-muted mb-0">
                              +{module.external_services.length - 3} more services
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Involved Actors */}
                    {module.involved_actors && module.involved_actors.length > 0 && (
                      <div>
                        <h4 className="h6 mb-3 d-flex align-items-center">
                          <Users className="me-2 text-primary" size={16} />
                          {t('moduleCompareView.actors.title')} ({module.involved_actors.length})
                        </h4>
                        <div className="d-flex flex-column gap-1">
                          {module.involved_actors.slice(0, 3).map((actor, index) => (
                            <div key={index} className="small">
                              <span className="fw-medium text-dark">{actor.name}</span>
                              {actor.role && (
                                <span className="text-muted ms-1">- {actor.role}</span>
                              )}
                            </div>
                          ))}
                          {module.involved_actors.length > 3 && (
                            <p className="small text-muted mb-0">
                              +{module.involved_actors.length - 3} more actors
                            </p>
                          )}
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

export default ModuleCompareView;