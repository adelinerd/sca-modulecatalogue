import React from 'react';
import { CityApp } from '../types';
import AppCard from './AppCard';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppListProps {
  apps: CityApp[];
  onSelectApp: (app: CityApp) => void;
  selectedApp: CityApp | null;
  onToggleCompare: (app: CityApp) => void;
  comparisonApps: CityApp[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const AppList: React.FC<AppListProps> = ({
  apps,
  onSelectApp,
  selectedApp,
  onToggleCompare,
  comparisonApps,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation();
  
  // Add safety check for app.name
  const filteredApps = apps.filter(app => {
    if (!app || !app.name) {
      console.warn('App with missing name found:', app);
      return false;
    }
    
    return (
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (app.provider && app.provider.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.short_description && app.short_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (app.modules && app.modules.some(module => 
        module.topic && module.topic.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  });
  
  return (
    <div className="col-12 col-md-4 col-lg-3 border-end overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      <div className="p-3 border-bottom bg-white sticky-top">
        <h2 className="h4 mb-3 text-dark">
          {t('appList.title')}
        </h2>
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <Search size={20} className="text-muted" />
          </div>
          <input
            type="text"
            placeholder={t('appList.searchPlaceholder')}
            className="form-control ps-5"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="p-3">
        <div className="row g-3">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, index) => (
              <div key={`${app.name}-${index}`} className="col-12">
                <AppCard
                  app={app}
                  onClick={() => onSelectApp(app)}
                  isSelected={selectedApp?.name === app.name}
                  onToggleCompare={() => onToggleCompare(app)}
                  isInCompareList={comparisonApps.some(a => a.name === app.name)}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 text-muted">
                {searchTerm ? t('appList.noResults', { searchTerm }) : 'No apps available'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppList;