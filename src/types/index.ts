export interface AppModule {
  name: string;
  optional?: string;
  topic?: string;
  opencode_repository?: string;
  screenshots?: string;
  use_cases?: string;
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
  involved_actors?: string[];
  technical_documentation?: string;
  deployed_in_municipalities?: string[];
  development_status?: string;
  last_update?: string;
}

export interface App {
  name: string;
  provider?: string;
  technical_specifications?: string;
  documentation?: string;
  deployed_in_municipalities?: string[];
  website?: string;
  opencode_repository?: string;
  modules?: AppModule[];
}

export interface AppState {
  apps: App[];
  selectedApp: App | null;
  comparisonApps: App[];
  isCompareMode: boolean;
  isDarkMode: boolean;
  searchTerm: string;
}