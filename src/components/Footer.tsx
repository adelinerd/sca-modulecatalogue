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

import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

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
                href="https://www.smart-city-dialog.de/impressum"
                target="_blank"
                rel="noopener noreferrer"
                className="small text-muted text-decoration-none"
              >
                {t('footer.impressum')}
              </a>
              <a
                href="https://www.smart-city-dialog.de/datenschutzerklaerung"
                target="_blank"
                rel="noopener noreferrer"
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