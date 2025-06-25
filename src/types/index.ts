export interface AppModule {
  name: string;
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
}

export interface CityApp {
  name: string;
  provider?: string;
  short_description?: string;
  website?: string;
  contact?: {
    email?: string;
    telefon?: string;
  }[];
  deployed_in_municipalities?: string[];
  opencode_repository?: string;
  documentation?: string;
  modules?: string[] | AppModule[];
  development_status?: string;
  last_update?: string;
}

export interface AppState {
  apps: CityApp[];
  selectedApp: CityApp | null;
  comparisonApps: CityApp[];
  isCompareMode: boolean;
  isDarkMode: boolean;
  searchTerm: string;
}

