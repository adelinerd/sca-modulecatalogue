# YAML Schema Documentation

This directory contains JSON Schema files for validating the YAML configuration files used in the City App Explorer.

## Schemas

### city-app-schema.json (v2.1.0)
Defines the structure for main city application YAML files (`city_app.yml`).

**Required fields:**
- `name`: The application name

**Optional fields:**
- `city-app-yml-version`: Version of the YAML schema being used (e.g., "1.0")
- `provider`: Organization providing the app
- `short_description`: Brief description
- `website`: Official website URL
- `contact`: Array of contact information (name, email, telefon)
- `development_partnership`: Array of development partnership information
- `deployed_in_municipalities`: Array of deployment locations
- `opencode_repository`: Open source repository URL
- `documentation`: Documentation URL
- `app_type`: Type of application (Native App, Web App, Desktop App, etc.)
- `modules`: Array of module URLs (can be absolute or relative)
- `development_status`: One of Alpha, Beta, Stable, Production, Deprecated
- `last_update`: Date in YYYY-MM-DD format

**Changes in v2.1.0:**
- Added `city-app-yml-version` field for schema versioning
- Added `app_type` field for application type classification
- Added `development_partnership` field for partnership information
- Enhanced documentation with examples

**Changes in v2.0.0:**
- `modules` field now contains URLs instead of file paths
- `contact` objects can now include a `name` field
- Module URLs can be absolute (https://...) or relative (/apps/...)

### app-module-schema.json (v1.0.0)
Defines the structure for application module YAML files.

**Required fields:**
- `name`: The module name

**Optional fields:**
- `app_name`: Name of the parent application
- `optional`: Whether module is optional (ja/nein/yes/no)
- `topic`: Module category
- `short_description`: Brief description
- `opencode_repository`: Repository URL
- `screenshots`: Screenshot filename/path or array of screenshots
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

## Schema Versioning

### city-app-yml-version Field
Starting with schema version 2.1.0, all city app YAML files should include a `city-app-yml-version` field to indicate which version of the schema they conform to. This enables:

- **Forward compatibility**: New schema versions can handle older YAML files
- **Migration support**: Tools can automatically upgrade YAML files to newer schema versions
- **Validation**: Appropriate schema validation based on the declared version

**Current version**: `1.0`

**Example usage**:
```yaml
name: "My Smart City App"
city-app-yml-version: "1.0"
provider: "City Tech Solutions"
# ... other fields
```

**Future considerations**:
- When breaking changes are introduced to the schema, increment the major version (e.g., 2.0)
- When adding optional fields, increment the minor version (e.g., 1.1)
- The application will validate YAML files against the appropriate schema version

## Usage

These schemas can be used with YAML validators or IDE extensions to ensure your YAML files conform to the expected structure. Many editors support JSON Schema validation for YAML files when properly configured.

## Version History

- **v2.1.0**: Added schema versioning support, app_type field, and development_partnership field
- **v2.0.0**: Updated to support URL-based module loading and enhanced contact information
- **v1.0.0**: Initial schema definitions based on DorfFunk and Sag's uns module structures