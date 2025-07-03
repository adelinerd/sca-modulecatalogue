import React from 'react';
import { CityApp } from '../types';
import { Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppCardProps {
  app: CityApp;
  onClick: () => void;
  isSelected: boolean;
  onToggleCompare: () => void;
  isInCompareList: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ 
  app, 
  onClick, 
  isSelected, 
  onToggleCompare, 
  isInCompareList 
}) => {
  const { t } = useTranslation();

  return (
    <div 
      className={`
        relative p-4 rounded-lg transition-all duration-300 cursor-pointer border
        ${isSelected 
          ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500 border-primary-200 dark:border-primary-700 shadow-md'
          : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 border-l-4 border-l-transparent'
        }
        shadow-sm hover:shadow-md
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center flex-1 min-w-0">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-100 dark:bg-primary-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
            <Landmark className={`h-5 w-5 ${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'}`} />
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {app.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {app.provider 
                ? t('appCard.provider', { provider: app.provider })
                : t('appCard.unknownProvider')}
            </p>
            {app.short_description && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                {app.short_description}
              </p>
            )}
          </div>
        </div>
        
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`
              text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200
              ${isInCompareList 
                ? 'bg-accent-500 text-white shadow-sm hover:bg-accent-600' 
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 hover:text-accent-600 dark:hover:text-accent-400 border border-gray-200 dark:border-gray-600'}
            `}
          >
            {isInCompareList ? t('appCard.selected') : t('appCard.compare')}
          </button>
        </div>
      </div>
      
      {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {t('appCard.deployedIn', { 
              municipalities: app.deployed_in_municipalities.slice(0, 2).join(', ') +
                (app.deployed_in_municipalities.length > 2 ? '...' : '')
            })}
          </p>
        </div>
      )}
      
      {app.development_status && (
        <div className="absolute top-3 right-3">
          <span className={`
            text-xs px-2 py-1 rounded-full font-medium
            ${app.development_status === 'Stable' 
              ? 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300' 
              : app.development_status === 'Beta'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
            }
          `}>
            {app.development_status}
          </span>
        </div>
      )}
    </div>
  );
};

export default AppCard;