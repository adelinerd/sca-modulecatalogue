import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <footer className="bg-body border-top mt-auto">
      <div className="container-fluid px-3 px-md-4 px-lg-5">
        <div className="row align-items-center py-3">
          <div className="col-12 col-md-6">
            <div className="small text-muted">
              © {currentYear} {t('footer.copyright')}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-md-end gap-3 mt-2 mt-md-0">
              <a
                href="/impressum"
                onClick={handleNavigation('/impressum')}
                className="small text-muted text-decoration-none"
              >
                {t('footer.impressum')}
              </a>
              <a
                href="/datenschutz"
                onClick={handleNavigation('/datenschutz')}
                className="small text-muted text-decoration-none"
              >
                {t('footer.privacy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;