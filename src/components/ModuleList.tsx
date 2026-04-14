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
import { AppModule } from '../types';
import ModuleCard from './ModuleCard';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ModuleListProps {
  modules: AppModule[];
  onSelectModule: (module: AppModule) => void;
  selectedModule: AppModule | null;
  onToggleCompare: (module: AppModule) => void;
  comparisonModules: AppModule[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
  onSelectModule,
  selectedModule,
  onToggleCompare,
  comparisonModules,
  searchTerm,
  onSearchChange,
}) => {
  const { t } = useTranslation();
  
  const filteredModules = modules.filter(module => 
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (module.topic && module.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (module.app_name && module.app_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (module.short_description && module.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="col-12 col-md-4 col-lg-3 border-end overflow-auto sidebar-panel">
      <div className="p-3 border-bottom bg-body sticky-top">
        <h2 className="h4 mb-3">
          {t('moduleList.title')}
        </h2>
        <div className="position-relative">
          <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
            <Search size={20} className="text-muted" />
          </div>
          <input
            type="text"
            placeholder={t('moduleList.searchPlaceholder')}
            className="form-control ps-5"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="p-3">
        <div className="row g-3">
          {filteredModules.length > 0 ? (
            filteredModules.map((module, index) => (
              <div key={`${module.name}-${index}`} className="col-12">
                <ModuleCard
                  module={module}
                  onClick={() => onSelectModule(module)}
                  isSelected={selectedModule?.name === module.name}
                  onToggleCompare={() => onToggleCompare(module)}
                  isInCompareList={comparisonModules.some(m => m.name === module.name)}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 text-muted">
                {t('moduleList.noResults', { searchTerm })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleList;