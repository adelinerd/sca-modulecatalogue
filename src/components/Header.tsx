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
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleLogoClick}
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t('header.title')}</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Smart City Dialog</p>
                </div>
              </div>

              {/* View Toggle */}
              <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleViewChange('apps')}
                  className={`
                    flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${currentView === 'apps'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-200 dark:border-primary-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  {t('header.apps')}
                </button>
                <button
                  onClick={() => handleViewChange('modules')}
                  className={`
                    flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                    ${currentView === 'modules'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm border border-primary-200 dark:border-primary-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t('header.modules')}
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* App Comparison Button */}
              {comparisonApps.length > 0 && currentView === 'apps' && (
                <button
                  onClick={onToggleCompareView}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                    ${isCompareMode 
                      ? 'bg-accent-500 text-white hover:bg-accent-600' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 border border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <span>{t('header.compare')}</span>
                  <span className={`ml-2 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold ${
                    isCompareMode 
                      ? 'bg-white/20 text-white' 
                      : 'bg-accent-500 text-white'
                  }`}>
                    {comparisonApps.length}
                  </span>
                </button>
              )}

              {/* Module Comparison Button */}
              {comparisonModules.length > 0 && currentView === 'modules' && (
                <button
                  onClick={onToggleModuleCompareView}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm
                    ${isModuleCompareMode 
                      ? 'bg-accent-500 text-white hover:bg-accent-600' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-accent-50 dark:hover:bg-accent-900/20 border border-gray-200 dark:border-gray-700'}
                  `}
                >
                  <span>{t('header.compareModules')}</span>
                  <span className={`ml-2 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold ${
                    isModuleCompareMode 
                      ? 'bg-white/20 text-white' 
                      : 'bg-accent-500 text-white'
                  }`}>
                    {comparisonModules.length}
                  </span>
                </button>
              )}

              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                aria-label={t('header.toggleLanguage')}
              >
                <Languages className="h-5 w-5" />
              </button>
              
              <button
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 border border-gray-200 dark:border-gray-700"
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