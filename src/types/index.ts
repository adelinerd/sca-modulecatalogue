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
}

export interface CityApp {
  name: string;
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
}

export interface AppState {
  apps: CityApp[];
  selectedApp: CityApp | null;
  comparisonApps: CityApp[];
  isCompareMode: boolean;
  isDarkMode: boolean;
  searchTerm: string;
}