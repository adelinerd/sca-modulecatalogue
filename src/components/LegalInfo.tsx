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
        const response = await fetch(`/${type === 'privacy' ? 'datenschutz' : type}.html`);
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
        <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-50 mb-6">
          {t(`footer.${type}`)}
        </h1>
        
        <div 
          className="prose dark:prose-invert max-w-none text-primary-900 dark:text-primary-50"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default LegalInfo;