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
      (app.short_description && app.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-primary-100 dark:border-primary-900 overflow-y-auto">
      <div className="p-4 border-b border-primary-100 dark:border-primary-900">
        <h2 className="text-xl font-semibold mb-4 text-primary-900 dark:text-primary-50">
          {t('appList.title')}
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder={t('appList.searchPlaceholder')}
            className="pl-10 pr-4 py-2 w-full border border-primary-200 dark:border-primary-800 rounded-lg 
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                     bg-white dark:bg-gray-800 text-primary-900 dark:text-primary-50
                     placeholder-primary-400 dark:placeholder-primary-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {filteredApps.length > 0 ? (
          filteredApps.map((app, index) => (
            <AppCard
              key={`${app.name}-${index}`}
              app={app}
              onClick={() => onSelectApp(app)}
              isSelected={selectedApp?.name === app.name}
              onToggleCompare={() => onToggleCompare(app)}
              isInCompareList={comparisonApps.some(a => a.name === app.name)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-primary-500 dark:text-primary-400">
            {searchTerm ? t('appList.noResults', { searchTerm }) : 'No apps available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppList;