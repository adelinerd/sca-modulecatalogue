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

export interface AppModule {
  name: string;
  app_name?: string; // Add app_name field
  optional?: string;
  topic?: string;
  short_description?: string;
  opencode_repository?: string;
  screenshots?: string | string[];
  usage_scenario?: string;
  description?: string;
  cost?: string;
  interfaces?: string[];
  dependencies?: string[];
  external_services?: {
    name: string;
    description?: string;
    url?: string;
  }[];
  customization_options?: string[];
  involved_actors?: {
    name?: string;
    role?: string;
  }[];
  technical_documentation?: string;
  deployed_in_municipalities?: string[];
  development_status?: string;
  last_update?: string;
  roadmap?: string[];
}

export interface CityApp {
  name: string;
  'city-app-yml-version'?: string; // Add city-app-yml-version field
  provider?: string;
  short_description?: string;
  website?: string;
  contact?: {
    name?: string;
    email?: string;
    telefon?: string;
  }[];
  development_partnership?: {
    name?: string;
    kontakt?: string;
  }[];
  deployed_in_municipalities?: string[];
  opencode_repository?: string;
  documentation?: string;
  app_type?: string; // Add app_type field
  modules?: AppModule[];
  moduleUrls?: string[]; // Keep track of original module URLs
  development_status?: string;
  last_update?: string;
  license?: {
    name?: string;
    url?: string;
  };
  logo?: {
    url?: string;
    description?: string;
  };
  screenshots?: {
    url: string;
    description?: string;
  }[];
}

export interface AppState {
  apps: CityApp[];
  selectedApp: CityApp | null;
  comparisonApps: CityApp[];
  isCompareMode: boolean;
  isDarkMode: boolean;
  searchTerm: string;
}