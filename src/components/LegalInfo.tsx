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
    <div className="flex-grow-1 py-5 container-fluid">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <h1 className="display-6 fw-bold text-primary mb-4 pb-3 border-bottom">
                {t(`footer.${type}`)}
              </h1>
              
              <div 
                className="legal-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalInfo;