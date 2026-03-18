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

import React, { useState } from 'react';
import { AppModule } from '../types';
import { Package, Image } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTopicLabel } from '../hooks/useTopicLabel';

interface ModuleCardProps {
  module: AppModule;
  onClick: () => void;
  isSelected: boolean;
  onToggleCompare: () => void;
  isInCompareList: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  onClick,
  isSelected,
  onToggleCompare,
  isInCompareList
}) => {
  const { t } = useTranslation();
  const topicLabel = useTopicLabel(module.topic);

  const firstImage = Array.isArray(module.screenshots)
    ? module.screenshots[0]
    : module.screenshots ?? null;

  const [imageError, setImageError] = useState(false);

  return (
    <div 
      className={`
        card position-relative cursor-pointer overflow-hidden transition-all
        ${isSelected 
          ? 'bg-primary-subtle border-primary border-2 shadow-sm' 
          : 'hover-shadow border-2 border-transparent'
        }
      `}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Image Section */}
      <div className="position-relative overflow-hidden border-bottom" style={{ height: '192px', backgroundColor: '#f8f9fa' }}>
        {firstImage && !imageError ? (
          <img
            src={firstImage}
            alt={`${module.name} screenshot`}
            className="w-100 h-100 object-fit-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-primary-subtle">
            <div className="text-center">
              <Image className="text-primary mb-2" size={48} />
              <p className="small text-primary fw-medium mb-0">
                {t('moduleCard.noImage')}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Category label — floats on the seam between image and card body */}
      {topicLabel && (
        <div
          className="position-absolute end-0 me-3 text-white small fw-semibold py-1 px-3 rounded-pill shadow-sm"
          style={{
            top: '192px',
            transform: 'translateY(-50%)',
            backgroundColor: 'var(--bs-primary)',
            zIndex: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {topicLabel}
        </div>
      )}

      {/* Content Section */}
      <div className="card-body p-3">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center flex-grow-1 min-width-0">
            <div className="bg-primary-subtle p-2 rounded flex-shrink-0">
              <Package className="text-primary" size={20} />
            </div>
            <div className="ms-3 min-width-0 flex-grow-1">
              <h5 className="card-title mb-1 text-truncate">
                {module.name}
              </h5>
              {module.app_name && (
                <div className="small text-muted text-truncate">
                  {t('moduleCard.fromApp', { appName: module.app_name })}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            className={`
              btn btn-sm rounded-pill flex-shrink-0 ms-2
              ${isInCompareList 
                ? 'btn-success' 
                : 'btn-outline-secondary'}
            `}
            style={{ fontSize: '0.75rem' }}
          >
            {isInCompareList ? t('moduleCard.selected') : t('moduleCard.compare')}
          </button>
        </div>

        {module.short_description && (
          <p className="card-text small text-muted mb-3 line-clamp-2">
            {module.short_description}
          </p>
        )}
        
        <div className="d-flex align-items-center justify-content-between">
          {module.optional && (
            <span className="badge text-bg-warning small">
              {t('moduleCard.optional')}: {module.optional}
            </span>
          )}
          
          {module.development_status && (
            <span className={`
              badge small
              ${module.development_status === 'Stable' 
                ? 'text-bg-success' 
                : module.development_status === 'Beta'
                  ? 'text-bg-info'
                  : 'text-bg-primary'
              }
            `}>
              {module.development_status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;