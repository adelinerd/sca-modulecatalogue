import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { App as AppType } from './types';
import useAppData from './hooks/useAppData';
import AppList from './components/AppList';
import AppDetails from './components/AppDetails';
import CompareView from './components/CompareView';
import Header from './components/Header';
import { Loader } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const { apps, loading, error } = useAppData();
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const [comparisonApps, setComparisonApps] = useState<AppType[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle dark mode toggle and system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Update the DOM when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Set first app as selected when data loads
  useEffect(() => {
    if (apps.length > 0 && !selectedApp) {
      setSelectedApp(apps[0]);
    }
  }, [apps, selectedApp]);

  const handleToggleCompare = (app: AppType) => {
    setComparisonApps(prevApps => {
      const isAlreadySelected = prevApps.some(a => a.name === app.name);
      
      if (isAlreadySelected) {
        return prevApps.filter(a => a.name !== app.name);
      } else {
        if (prevApps.length >= 2) {
          return [...prevApps.slice(1), app];
        }
        return [...prevApps, app];
      }
    });
  };

  const handleToggleCompareView = () => {
    setIsCompareMode(prev => !prev);
  };

  const handleRemoveFromCompare = (app: AppType) => {
    setComparisonApps(prevApps => prevApps.filter(a => a.name !== app.name));
    
    if (comparisonApps.length <= 1) {
      setIsCompareMode(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">{t('loading.title')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">{t('loading.error.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            {t('loading.error.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <Header 
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
        comparisonApps={comparisonApps}
        onToggleCompareView={handleToggleCompareView}
        isCompareMode={isCompareMode}
      />
      
      <main className="flex flex-1 overflow-hidden">
        <AppList 
          apps={apps}
          onSelectApp={setSelectedApp}
          selectedApp={selectedApp}
          onToggleCompare={handleToggleCompare}
          comparisonApps={comparisonApps}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        {isCompareMode ? (
          <CompareView 
            apps={comparisonApps}
            onClose={() => setIsCompareMode(false)}
            onRemoveApp={handleRemoveFromCompare}
          />
        ) : (
          selectedApp && <AppDetails app={selectedApp} />
        )}
      </main>
    </div>
  );
}

export default App;