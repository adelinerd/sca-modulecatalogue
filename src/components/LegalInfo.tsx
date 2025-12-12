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
        const response = await fetch(`/${type === 'privacy' ? 'datenschutz' : 'impressum'}.html`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        // Extract body content from the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const bodyContent = doc.body.innerHTML;

        setContent(bodyContent);
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
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div
                className="legal-content"
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                  lineHeight: '1.8',
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