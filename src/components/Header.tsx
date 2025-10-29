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
    <header className="bg-body border-bottom shadow-sm">
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        <div className="row align-items-center py-3">
          <div className="col-auto">
            <div
              className="d-flex align-items-center cursor-pointer"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="p-2 rounded scd-gradient-bg me-3">
                <Layers className="text-white" size={24} />
              </div>
              <div>
                <h1 className="h4 mb-0">{t('header.title')}</h1>
                <p className="small text-muted mb-0">Smart City Dialog</p>
              </div>
            </div>
          </div>

          <div className="col-auto ms-4">
            {/* View Toggle */}
            <div className="btn-group" role="group">
              <button
                onClick={() => handleViewChange('apps')}
                className={`btn btn-sm ${
                  currentView === 'apps'
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
              >
                <Layers size={16} className="me-1" />
                {t('header.apps')}
              </button>
              <button
                onClick={() => handleViewChange('modules')}
                className={`btn btn-sm ${
                  currentView === 'modules'
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                }`}
              >
                <Package size={16} className="me-1" />
                {t('header.modules')}
              </button>
            </div>
          </div>
          
          <div className="col d-flex justify-content-end align-items-center">
            <div className="d-flex align-items-center gap-2">
              {/* App Comparison Button */}
              {comparisonApps.length > 0 && currentView === 'apps' && (
                <button
                  onClick={onToggleCompareView}
                  className={`btn btn-sm ${
                    isCompareMode 
                      ? 'btn-success' 
                      : 'btn-outline-primary'
                  }`}
                >
                  <span>{t('header.compare')}</span>
                  <span className={`badge ms-2 ${
                    isCompareMode
                      ? 'bg-body-secondary text-success'
                      : 'bg-primary'
                  }`}>
                    {comparisonApps.length}
                  </span>
                </button>
              )}

              {/* Module Comparison Button */}
              {comparisonModules.length > 0 && currentView === 'modules' && (
                <button
                  onClick={onToggleModuleCompareView}
                  className={`btn btn-sm ${
                    isModuleCompareMode 
                      ? 'btn-success' 
                      : 'btn-outline-primary'
                  }`}
                >
                  <span>{t('header.compareModules')}</span>
                  <span className={`badge ms-2 ${
                    isModuleCompareMode
                      ? 'bg-body-secondary text-success'
                      : 'bg-primary'
                  }`}>
                    {comparisonModules.length}
                  </span>
                </button>
              )}

              <button
                onClick={toggleLanguage}
                className="btn btn-outline-secondary btn-sm"
                title={t('header.toggleLanguage')}
              >
                <Languages size={18} />
              </button>
              
              <button
                onClick={onToggleDarkMode}
                className="btn btn-outline-secondary btn-sm"
                title={t('header.darkMode')}
              >
                {isDarkMode ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
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