import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LegalInfoProps {
  type: 'impressum' | 'privacy';
}

const LegalInfo: React.FC<LegalInfoProps> = ({ type }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`/${type === 'privacy' ? 'privacy' : 'impressum'}.html`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        setContent(html);
      } catch (error) {
        console.error(`Error loading ${type} content:`, error);
        setContent('');
      }
    };

    fetchContent();
  }, [type]);

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary-900 dark:text-primary-50 mb-8 border-b border-primary-200 dark:border-primary-700 pb-4">
          {t(`footer.${type}`)}
        </h1>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-primary-900 dark:prose-headings:text-primary-50
            prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:border-b prose-h1:border-primary-200 dark:prose-h1:border-primary-700 prose-h1:pb-3
            prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-primary-800 dark:prose-h2:text-primary-100
            prose-h3:text-lg prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-4 prose-h3:text-primary-700 dark:prose-h3:text-primary-200
            prose-p:text-primary-900 dark:prose-p:text-primary-50 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300
            prose-strong:text-primary-900 dark:prose-strong:text-primary-50 prose-strong:font-semibold
            prose-ul:my-4 prose-li:my-1 prose-li:text-primary-900 dark:prose-li:text-primary-50
            prose-ol:my-4
            first:prose-h1:mt-0 first:prose-h2:mt-0"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default LegalInfo;