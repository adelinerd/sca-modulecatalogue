import React from 'react';
import { App } from '../types';
import AppCard from './AppCard';
import { Search } from 'lucide-react';

interface AppListProps {
  apps: App[];
  onSelectApp: (app: App) => void;
  selectedApp: App | null;
  onToggleCompare: (app: App) => void;
  comparisonApps: App[];
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
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (app.provider && app.provider.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-primary-100 dark:border-primary-900 overflow-y-auto">
      <div className="p-4 border-b border-primary-100 dark:border-primary-900">
        <h2 className="text-xl font-semibold mb-4 text-primary-900 dark:text-primary-50">Applications</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder="Search applications..."
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
          filteredApps.map((app) => (
            <AppCard
              key={app.name}
              app={app}
              onClick={() => onSelectApp(app)}
              isSelected={selectedApp?.name === app.name}
              onToggleCompare={() => onToggleCompare(app)}
              isInCompareList={comparisonApps.some(a => a.name === app.name)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-primary-500 dark:text-primary-400">
            No applications found matching '{searchTerm}'
          </div>
        )}
      </div>
    </div>
  );
};

export default AppList;