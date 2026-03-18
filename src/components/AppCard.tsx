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
import { CityApp } from '../types';
import { Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AppCardProps {
  app: CityApp;
  onClick: () => void;
  isSelected: boolean;
  onToggleCompare: () => void;
  isInCompareList: boolean;
}

const AppCard: React.FC<AppCardProps> = ({ 
  app, 
  onClick, 
  isSelected, 
  onToggleCompare, 
  isInCompareList 
}) => {
  const { t } = useTranslation();

  return (
    <div 
      className={`
        card h-100 position-relative cursor-pointer border-start-4 
        ${isSelected 
          ? 'bg-primary-subtle border-start-primary shadow-sm' 
          : 'border-start-transparent hover-shadow'
        }
      `}
      onClick={onClick}
      style={{ 
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between">
          <div className="d-flex align-items-center flex-grow-1 min-width-0">
            <div className={`
              p-2 rounded d-flex align-items-center justify-content-center me-3
              ${isSelected ? 'bg-primary text-white' : 'bg-light text-muted'}
            `}>
              <Landmark size={20} />
            </div>
            <div className="flex-grow-1 min-width-0">
              <h5 className="card-title mb-1 text-truncate">
                {app.name}
              </h5>
              <p className="card-text text-muted small mb-1 text-truncate">
                {app.provider 
                  ? t('appCard.provider', { provider: app.provider })
                  : t('appCard.unknownProvider')}
              </p>
              {app.short_description && (
                <p className="card-text small text-muted mb-0 line-clamp-2">
                  {app.short_description}
                </p>
              )}
            </div>
          </div>
          
          <div className="ms-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
              }}
              className={`
                btn btn-sm rounded-pill
                ${isInCompareList 
                  ? 'btn-success' 
                  : 'btn-outline-secondary'}
              `}
              style={{ fontSize: '0.75rem' }}
            >
              {isInCompareList ? t('appCard.selected') : t('appCard.compare')}
            </button>
          </div>
        </div>
        
        {app.deployed_in_municipalities && app.deployed_in_municipalities.length > 0 && (
          <div className="mt-2">
            <p className="card-text small text-muted mb-0">
              {t('appCard.deployedIn', { 
                municipalities: app.deployed_in_municipalities.slice(0, 2).join(', ') +
                  (app.deployed_in_municipalities.length > 2 ? '...' : '')
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppCard;