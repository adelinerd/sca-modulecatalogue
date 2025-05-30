import React from 'react';
import { Sun, Moon, Layers, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  comparisonApps: any[];
  onToggleCompareView: () => void;
  isCompareMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  comparisonApps,
  onToggleCompareView,
  isCompareMode
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

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-primary-100 dark:border-primary-900 py-4 px-6 flex items-center justify-between transition-colors duration-200">
      <div 
        className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        <Layers className="h-6 w-6 text-primary-500 dark:text-primary-400" />
        <h1 className="text-xl font-bold text-primary-900 dark:text-primary-50">{t('header.title')}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {comparisonApps.length > 0 && (
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
            {comparisonApps.length > 0 && (
              <span className="ml-1.5 bg-teal-200 dark:bg-teal-700 text-teal-800 dark:text-teal-200 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {comparisonApps.length}
              </span>
            )}
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
    </header>
  );
};

export default Header;