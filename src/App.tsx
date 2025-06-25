import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CityApp, AppModule } from './types';
import useAppData from './hooks/useAppData';
import AppList from './components/AppList';
import AppDetails from './components/AppDetails';
import CompareView from './components/CompareView';
import ModuleList from './components/ModuleList';
import ModuleDetails from './components/ModuleDetails';
import ModuleCompareView from './components/ModuleCompareView';
import Header from './components/Header';
import Footer from './components/Footer';
import LegalInfo from './components/LegalInfo';
import { Loader } from 'lucide-react';

function App() {
  const { t, i18n } = useTranslation();
  const { apps, loading, error } = useAppData();
  const [selectedApp, setSelectedApp] = useState<CityApp | null>(null);
  const [selectedModule, setSelectedModule] = useState<AppModule | null>(null);
  const [comparisonApps, setComparisonApps] = useState<CityApp[]>([]);
  const [comparisonModules, setComparisonModules] = useState<AppModule[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isModuleCompareMode, setIsModuleCompareMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleSearchTerm, setModuleSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'apps' | 'modules' | 'impressum' | 'privacy'>('apps');
  const [navigationState, setNavigationState] = useState<{
    fromApp?: CityApp;
    showingModuleFromApp?: boolean;
  }>({});

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
    if (apps.length > 0 && !selectedApp && currentView === 'apps' && !navigationState.showingModuleFromApp) {
      setSelectedApp(apps[0]);
    }
  }, [apps, selectedApp, currentView, navigationState.showingModuleFromApp]);

  // Get all modules from all apps for module view
  const allModules = React.useMemo(() => {
    const modules: AppModule[] = [];
    apps.forEach(app => {
      if (app.modules && Array.isArray(app.modules)) {
        app.modules.forEach(module => {
          if (typeof module === 'object') {
            modules.push(module);
          }
        });
      }
    });
    return modules;
  }, [apps]);

  // Set first module as selected when switching to module view
  useEffect(() => {
    if (allModules.length > 0 && !selectedModule && currentView === 'modules' && !navigationState.showingModuleFromApp) {
      setSelectedModule(allModules[0]);
    }
  }, [allModules, selectedModule, currentView, navigationState.showingModuleFromApp]);

  const handleToggleCompare = (app: CityApp) => {
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

  const handleToggleModuleCompare = (module: AppModule) => {
    setComparisonModules(prevModules => {
      const isAlreadySelected = prevModules.some(m => m.name === module.name);
      
      if (isAlreadySelected) {
        return prevModules.filter(m => m.name !== module.name);
      } else {
        if (prevModules.length >= 2) {
          return [...prevModules.slice(1), module];
        }
        return [...prevModules, module];
      }
    });
  };

  const handleToggleCompareView = () => {
    setIsCompareMode(prev => !prev);
  };

  const handleToggleModuleCompareView = () => {
    setIsModuleCompareMode(prev => !prev);
  };

  const handleRemoveFromCompare = (app: CityApp) => {
    setComparisonApps(prevApps => prevApps.filter(a => a.name !== app.name));
    
    if (comparisonApps.length <= 1) {
      setIsCompareMode(false);
    }
  };

  const handleRemoveModuleFromCompare = (module: AppModule) => {
    setComparisonModules(prevModules => prevModules.filter(m => m.name !== module.name));
    
    if (comparisonModules.length <= 1) {
      setIsModuleCompareMode(false);
    }
  };

  // Handle module navigation from app view
  const handleModuleClick = (module: AppModule, fromApp: CityApp) => {
    setSelectedModule(module);
    setNavigationState({
      fromApp,
      showingModuleFromApp: true
    });
  };

  // Handle back navigation to app view
  const handleBackToApp = () => {
    if (navigationState.fromApp) {
      setSelectedApp(navigationState.fromApp);
      setSelectedModule(null);
      setNavigationState({});
    }
  };

  // Handle navigation
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/impressum') {
        setCurrentView('impressum');
      } else if (path === '/datenschutz') {
        setCurrentView('privacy');
      } else if (path === '/modules') {
        setCurrentView('modules');
        // Clear navigation state when switching to modules view
        setNavigationState({});
      } else {
        setCurrentView('apps');
        // Clear navigation state when switching to apps view
        if (!navigationState.showingModuleFromApp) {
          setNavigationState({});
        }
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [navigationState.showingModuleFromApp]);

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
        comparisonModules={comparisonModules}
        onToggleCompareView={handleToggleCompareView}
        onToggleModuleCompareView={handleToggleModuleCompareView}
        isCompareMode={isCompareMode}
        isModuleCompareMode={isModuleCompareMode}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {currentView === 'apps' ? (
          <>
            {/* Show module details when navigating from app */}
            {navigationState.showingModuleFromApp && selectedModule ? (
              <ModuleDetails 
                module={selectedModule} 
                onBack={handleBackToApp}
                showBackButton={true}
                backToApp={navigationState.fromApp}
              />
            ) : (
              <>
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
                  selectedApp && (
                    <AppDetails 
                      app={selectedApp} 
                      onModuleClick={handleModuleClick}
                    />
                  )
                )}
              </>
            )}
          </>
        ) : currentView === 'modules' ? (
          <>
            <ModuleList 
              modules={allModules}
              onSelectModule={setSelectedModule}
              selectedModule={selectedModule}
              onToggleCompare={handleToggleModuleCompare}
              comparisonModules={comparisonModules}
              searchTerm={moduleSearchTerm}
              onSearchChange={setModuleSearchTerm}
            />
            
            {isModuleCompareMode ? (
              <ModuleCompareView 
                modules={comparisonModules}
                onClose={() => setIsModuleCompareMode(false)}
                onRemoveModule={handleRemoveModuleFromCompare}
              />
            ) : (
              selectedModule && (
                <ModuleDetails 
                  module={selectedModule} 
                  showBackButton={false}
                />
              )
            )}
          </>
        ) : (
          <LegalInfo type={currentView} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App