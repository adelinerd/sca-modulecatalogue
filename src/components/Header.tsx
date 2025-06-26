import React from 'react';
import { Sun, Moon, Layers, Languages, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppModule } from '../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  comparisonApps: any[];
  comparisonModules: AppModule[];
  onToggleCompareView: () => void;
  onToggleModuleCompareView: () => void;
  isCompareMode: boolean;
  isModuleCompareMode: boolean;
  currentView: 'apps' | 'modules' | 'impressum' | 'privacy';
  onViewChange: (view: 'apps' | 'modules' | 'impressum' | 'privacy') => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  comparisonApps,
  comparisonModules,
  onToggleCompareView,
  onToggleModuleCompareView,
  isCompareMode,
  isModuleCompareMode,
  currentView,
  onViewChange
}) => {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogoClick = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const handleViewChange = (view: 'apps' | 'modules') => {
    const path = view === 'modules' ? '/modules' : '/';
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-primary-100 dark:border-primary-900 transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div 
                className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <Layers className="h-6 w-6 text-primary-500 dark:text-primary-400" />
                <h1 className="text-xl font-bold text-primary-900 dark:text-primary-50">{t('header.title')}</h1>
              </div>

              {/* View Toggle */}
              <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleViewChange('apps')}
                  className={`
                    flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                    ${currentView === 'apps'
                      ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300'
                    }
                  `}
                >
                  <Layers className="h-4 w-4 mr-1.5" />
                  {t('header.apps')}
                </button>
                <button
                  onClick={() => handleViewChange('modules')}
                  className={`
                    flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                    ${currentView === 'modules'
                      ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:text-primary-300'
                    }
                  `}
                >
                  <Package className="h-4 w-4 mr-1.5" />
                  {t('header.modules')}
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* App Comparison Button */}
              {comparisonApps.length > 0 && currentView === 'apps' && (
                <button
                  onClick={onToggleCompareView}
                  className={`
                    flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                    ${isCompareMode 
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
                      : 'bg-gray-100 text-primary-700 dark:bg-gray-800 dark:text-primary-300 hover:bg-teal-50 dark:hover:bg-teal-900/50'}
                  `}
                >
                  <span>{t('header.compare')}</span>
                  <span className="ml-1.5 bg-teal-200 dark:bg-teal-700 text-teal-800 dark:text-teal-200 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {comparisonApps.length}
                  </span>
                </button>
              )}

              {/* Module Comparison Button */}
              {comparisonModules.length > 0 && currentView === 'modules' && (
                <button
                  onClick={onToggleModuleCompareView}
                  className={`
                    flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200
                    ${isModuleCompareMode 
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
                      : 'bg-gray-100 text-primary-700 dark:bg-gray-800 dark:text-primary-300 hover:bg-teal-50 dark:hover:bg-teal-900/50'}
                  `}
                >
                  <span>{t('header.compareModules')}</span>
                  <span className="ml-1.5 bg-teal-200 dark:bg-teal-700 text-teal-800 dark:text-teal-200 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {comparisonModules.length}
                  </span>
                </button>
              )}

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors duration-200"
                aria-label={t('header.toggleLanguage')}
              >
                <Languages className="h-5 w-5" />
              </button>
              
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-full bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors duration-200"
                aria-label={t('header.darkMode')}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;