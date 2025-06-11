import React from 'react';
import { AppModule } from '../types';
import { Package } from 'lucide-react';
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

  return (
    <div 
      className={`
        relative p-4 rounded-lg transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'bg-primary-50 dark:bg-primary-900 border-l-4 border-primary-500'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
        }
        shadow-sm hover:shadow-md
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="bg-primary-50 dark:bg-primary-900 p-2 rounded-lg">
            <Package className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
              {module.name}
            </h3>
            {module.topic && (
              <p className="text-sm text-primary-600 dark:text-primary-400">
                {module.topic}
              </p>
            )}
            {module.short_description && (
              <p className="text-xs text-primary-500 dark:text-primary-400 mt-1 line-clamp-2">
                {module.short_description}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`
              text-xs px-3 py-1 rounded-full
              ${isInCompareList 
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
                : 'bg-gray-100 text-primary-600 dark:bg-gray-700 dark:text-primary-300 hover:bg-teal-50 dark:hover:bg-teal-900/50'}
              transition-colors duration-200
            `}
          >
            {isInCompareList ? t('moduleCard.selected') : t('moduleCard.compare')}
          </button>
        </div>
      </div>
      
      {module.optional && (
        <div className="mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {t('moduleCard.optional')}: {module.optional}
          </span>
        </div>
      )}
      
      {module.development_status && (
        <div className="absolute top-2 right-2">
          <span className={`
            text-xs px-2 py-0.5 rounded-full
            ${module.development_status === 'Stable' 
              ? 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300' 
              : module.development_status === 'Beta'
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
                : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
            }
          `}>
            {module.development_status}
          </span>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;