import React from 'react';
import { App } from '../types';
import { Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppCardProps {
  app: App;
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
            <Landmark className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-primary-900 dark:text-primary-50">
              {app.name}
            </h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              {app.provider 
                ? t('appCard.provider', { provider: app.provider })
                : t('appCard.unknownProvider')}
            </p>
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
            {isInCompareList ? t('appCard.selected') : t('appCard.compare')}
          </button>
        </div>
      </div>
      
      {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-primary-600 dark:text-primary-400">
            {t('appCard.deployedIn', { 
              municipalities: app.deployed_in_municipalities.slice(0, 2).join(', ') +
                (app.deployed_in_municipalities.length > 2 ? '...' : '')
            })}
          </p>
        </div>
      )}
      
      {app.development_status && (
        <div className="absolute top-2 right-2">
          <span className={`
            text-xs px-2 py-0.5 rounded-full
            ${app.development_status === 'Stable' 
              ? 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300' 
              : app.development_status === 'Beta'
                ? 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300'
                : 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
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