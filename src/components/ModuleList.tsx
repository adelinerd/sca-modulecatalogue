import React from 'react';
import { AppModule } from '../types';
import ModuleCard from './ModuleCard';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleListProps {
  modules: AppModule[];
  onSelectModule: (module: AppModule) => void;
  selectedModule: AppModule | null;
  onToggleCompare: (module: AppModule) => void;
  comparisonModules: AppModule[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  onSelectModule,
  selectedModule,
  onToggleCompare,
  comparisonModules,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation();
  
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (module.topic && module.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (module.short_description && module.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-primary-100 dark:border-primary-900 overflow-y-auto">
      <div className="p-4 border-b border-primary-100 dark:border-primary-900">
        <h2 className="text-xl font-semibold mb-4 text-primary-900 dark:text-primary-50">
          {t('moduleList.title')}
        </h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary-400" />
          </div>
          <input
            type="text"
            placeholder={t('moduleList.searchPlaceholder')}
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
        {filteredModules.length > 0 ? (
          filteredModules.map((module, index) => (
            <ModuleCard
              key={`${module.name}-${index}`}
              module={module}
              onClick={() => onSelectModule(module)}
              isSelected={selectedModule?.name === module.name}
              onToggleCompare={() => onToggleCompare(module)}
              isInCompareList={comparisonModules.some(m => m.name === module.name)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-primary-500 dark:text-primary-400">
            {t('moduleList.noResults', { searchTerm })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleList;