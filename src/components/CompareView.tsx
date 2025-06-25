import React from 'react';
import { CityApp } from '../types';
import { X, Calendar, Server, ExternalLink, Package, AlertCircle } from 'lucide-react';

interface CompareViewProps {
  apps: CityApp[];
  onClose: () => void;
  onRemoveApp: (app: CityApp) => void;
}

const CompareView: React.FC<CompareViewProps> = ({ apps, onClose, onRemoveApp }) => {
  if (apps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <AlertCircle className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50 mb-2">
            No Applications Selected
          </h3>
          <p className="text-primary-600 dark:text-primary-400">
            Select up to two applications to compare their features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto animate-fadeIn">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-primary-100 dark:border-primary-900 p-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
          Comparing Applications ({apps.length}/2)
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
          aria-label="Close comparison view"
        >
          <X className="h-5 w-5 text-primary-600 dark:text-primary-400" />
        </button>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {apps.map((app) => (
            <div key={app.name} className="relative">
              <button
                onClick={() => onRemoveApp(app)}
                className="absolute right-2 top-2 p-1.5 rounded-full bg-primary-50 dark:bg-primary-900 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
                aria-label={`Remove ${app.name} from comparison`}
              >
                <X className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-primary-100 dark:border-primary-900">
                <div className="bg-primary-50 dark:bg-primary-900/50 px-4 py-3 border-b border-primary-100 dark:border-primary-900">
                  <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">{app.name}</h3>
                  {app.provider && (
                    <p className="text-sm text-primary-600 dark:text-primary-400">by {app.provider}</p>
                  )}
                  {app.short_description && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">{app.short_description}</p>
                  )}
                </div>
                
                <div className="p-4 space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                      Details
                    </h4>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <dt className="text-primary-600 dark:text-primary-400">Status</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {app.development_status || 'Not specified'}
                      </dd>
                      <dt className="text-primary-600 dark:text-primary-400">Last Update</dt>
                      <dd className="text-primary-900 dark:text-primary-50">
                        {app.last_update || 'Not specified'}
                      </dd>
                    </dl>
                  </div>
                  
                  {/* Links */}
                  <div>
                    <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-2 text-primary-500" />
                      Resources
                    </h4>
                    <div className="space-y-2">
                      {app.documentation && (
                        <a
                          href={app.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                        >
                          Documentation
                        </a>
                      )}
                      {app.website && (
                        <a
                          href={app.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                        >
                          Website
                        </a>
                      )}
                      {app.opencode_repository && (
                        <a
                          href={app.opencode_repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
                        >
                          Repository
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Deployments */}
                  {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Server className="h-4 w-4 mr-2 text-primary-500" />
                        Deployments
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {app.deployed_in_municipalities.map((municipality, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full"
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
                      <h4 className="text-sm font-medium text-primary-900 dark:text-primary-50 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-primary-500" />
                        Modules ({app.modules.length})
                      </h4>
                      <div className="space-y-3">
                        {app.modules.map((module, index) => (
                          <div 
                            key={index}
                            className="border border-primary-100 dark:border-primary-900 rounded p-2"
                          >
                            <div className="font-medium text-primary-900 dark:text-primary-50 mb-1">
                              {module.name}
                            </div>
                            {module.topic && (
                              <span className="inline-block px-2 py-0.5 text-xs bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full mb-2">
                                {module.topic}
                              </span>
                            )}
                            {module.short_description && (
                              <p className="text-xs text-primary-600 dark:text-primary-400 line-clamp-2 mb-1 font-medium">
                                {module.short_description}
                              </p>
                            )}
                            {module.description && (
                              <p className="text-xs text-primary-600 dark:text-primary-400 line-clamp-3">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompareView;