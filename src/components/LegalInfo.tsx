/*
 * Modulbibliothek
 *
 * Copyright (c) 2026 Fraunhofer IESE, Adeline Silva Schäfer
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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