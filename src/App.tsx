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
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-bs-theme', 'light');
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
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
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
    setCurrentView('apps'); // Ensure we stay in apps view
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
      // Force a re-render by updating the URL state
      window.history.replaceState({}, '', '/');
    }
  };

  // Handle navigation
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/impressum') {
        setCurrentView('impressum');
        // Clear navigation state when switching views
        setNavigationState({});
      } else if (path === '/datenschutz') {
        setCurrentView('privacy');
        // Clear navigation state when switching views
        setNavigationState({});
      } else if (path === '/modules') {
        setCurrentView('modules');
        // Clear navigation state when switching to modules view
        setNavigationState({});
      } else {
        setCurrentView('apps');
        // Don't clear navigation state here if we're showing a module from an app
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 bg-body d-flex align-items-center justify-content-center">
        <div className="d-flex flex-column align-items-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">{t('loading.title')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-body d-flex align-items-center justify-content-center px-3">
        <div className="card shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
          <div className="card-body p-4">
            <h2 className="h4 text-danger mb-3">{t('loading.error.title')}</h2>
            <p className="card-text text-muted">{error}</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              {t('loading.error.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-body d-flex flex-column">
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
      
      {/* Main content with horizontal padding */}
      <div className="flex-grow-1 px-3 px-md-4 px-lg-5">
        <div className="container-fluid">
          <main className="d-flex flex-grow-1 overflow-hidden">
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
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;