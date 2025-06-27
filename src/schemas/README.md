# YAML Schema Documentation

This directory contains JSON Schema files for validating the YAML configuration files used in the City App Explorer.

## Schemas

### city-app-schema.json (v2.0.0)
Defines the structure for main city application YAML files (`city_app.yml`).

**Required fields:**
- `name`: The application name

**Optional fields:**
- `provider`: Organization providing the app
- `short_description`: Brief description
- `website`: Official website URL
- `contact`: Array of contact information (name, email, telefon)
- `deployed_in_municipalities`: Array of deployment locations
- `opencode_repository`: Open source repository URL
- `documentation`: Documentation URL
- `modules`: Array of module URLs (can be absolute or relative)
- `development_status`: One of Alpha, Beta, Stable, Production, Deprecated
- `last_update`: Date in YYYY-MM-DD format

**Changes in v2.0.0:**
- `modules` field now contains URLs instead of file paths
- `contact` objects can now include a `name` field
- Module URLs can be absolute (https://...) or relative (/apps/...)

### app-module-schema.json (v1.0.0)
Defines the structure for application module YAML files.

**Required fields:**
- `name`: The module name

**Optional fields:**
- `optional`: Whether module is optional (ja/nein/yes/no)
- `topic`: Module category
- `short_description`: Brief description
- `opencode_repository`: Repository URL
- `screenshots`: Screenshot filename/path
- `usage_scenario`: Detailed usage description
- `description`: Detailed functionality description
- `cost`: Cost information
- `interfaces`: Array of interfaces
- `dependencies`: Array of dependencies
- `external_services`: Array of external service objects
- `customization_options`: Array of customization options
- `involved_actors`: Array of actor objects (name, role)
- `technical_documentation`: Technical docs URL
- `deployed_in_municipalities`: Array of deployment locations
- `development_status`: Development status enum
- `last_update`: Date in YYYY-MM-DD format

## Manifest Structure

### manifest.json
The manifest file now uses the following structure:

```json
{
  "apps": [
    {
      "name": "App Name",
      "app_yml_url": "/path/to/app.yml"
    }
  ]
}
```

**Fields:**
- `name`: Display name of the application
- `app_yml_url`: URL to the application's YAML file (can be absolute or relative)

## Usage

These schemas can be used with YAML validators or IDE extensions to ensure your YAML files conform to the expected structure. Many editors support JSON Schema validation for YAML files when properly configured.

## Version History

- **v2.0.0**: Updated to support URL-based module loading and enhanced contact information
- **v1.0.0**: Initial schema definitions based on DorfFunk and Sag's uns module structures