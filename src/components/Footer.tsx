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
    <footer className="bg-white dark:bg-gray-900 border-t border-primary-100 dark:border-primary-900">
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="py-4 flex flex-col md:flex-row justify-between items-center text-sm text-primary-600 dark:text-primary-400">
            <div className="mb-2 md:mb-0">
              © {currentYear} {t('footer.copyright')}
            </div>
            <div className="flex space-x-4">
              <a
                href="/impressum"
                onClick={handleNavigation('/impressum')}
                className="hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
              >
                {t('footer.impressum')}
              </a>
              <a
                href="/datenschutz"
                onClick={handleNavigation('/datenschutz')}
                className="hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
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