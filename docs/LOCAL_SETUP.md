# Running SCA-Modulbibliothek with Local Files

This guide explains how to run the SCA-Modulbibliothek (Smart City Apps Module Catalogue) using locally stored YAML files instead of fetching them from remote Git repositories.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [File Structure](#file-structure)
- [Adding a New Application](#adding-a-new-application)
- [Adding Modules to an Application](#adding-modules-to-an-application)
- [Converting Remote Files to Local Storage](#converting-remote-files-to-local-storage)
- [Deployment with Local Files](#deployment-with-local-files)
- [Troubleshooting](#troubleshooting)

## Overview

The SCA-Modulbibliothek can load application and module data from two sources:

1. **Remote Git Repositories** (GitLab, GitHub) - Requires proxy server for GitLab URLs
2. **Local Files** (Recommended for development) - No proxy server needed

This guide focuses on option 2: using local files.

## Quick Start

### 1. Install and Start the Application

```bash
# Clone the repository
git clone https://github.com/adelinerd/sca-modulecatalogue.git
cd sca-modulecatalogue

# Install dependencies
npm install

# Start the development server
npm start
```

The application will start at `http://localhost:5173` and automatically load apps from local files.

### 2. Verify Local Apps are Loading

Open the browser console (F12) and check for log messages like:
```
Local URL detected, no proxy needed: /apps/DorfFunk/city_app.yml
Successfully loaded app: DorfFunk
```

## File Structure

All local application data is stored in the `public/apps/` directory:

```
public/apps/
├── manifest.json                    # Registry of all applications
├── DorfFunk/
│   ├── city_app.yml                # Application metadata
│   └── modules/
│       ├── events.yml              # Module definition
│       └── sags_uns.yml            # Module definition
├── Smart-City-Platform/
│   ├── city_app.yml
│   └── modules/
│       ├── citizen-participation.yml
│       └── environmental-monitoring.yml
└── YourNewApp/                     # Your custom application
    ├── city_app.yml
    └── modules/
        ├── module1.yml
        └── module2.yml
```

## Adding a New Application

### Step 1: Create Directory Structure

Create a new directory under `public/apps/` with your application name:

```bash
mkdir -p public/apps/MySmartCityApp/modules
```

### Step 2: Create the Application YAML File

Create `public/apps/MySmartCityApp/city_app.yml`:

### Step 3: Register the Application in the Manifest

Edit `public/apps/manifest.json` to add your application:

```json
{
  "apps": [
    {
      "name": "DorfFunk",
      "app_yml_url": "/apps/DorfFunk/city_app.yml"
    },
    {
      "name": "MySmartCityApp",
      "app_yml_url": "/apps/MySmartCityApp/city_app.yml"
    }
  ]
}
```

**Important Notes:**
- Use forward slashes `/` in paths (works on all platforms)
- Start paths with `/apps/` to reference files in the `public/apps/` directory
- The application will automatically load when you refresh the page

### Step 4: Restart the Development Server

If the development server is running, you may need to restart it to pick up the new manifest:

```bash
# Press Ctrl+C to stop the server
npm start
```


## Converting Remote Files to Local Storage

If you want to convert an application that's currently loading from a remote Git repository to use local files instead:

### Step 1: Download the Files from the Repository

Download the `city_app.yml` file and all module YAML files from the Git repository to your local machine. You can:

- Clone the entire repository
- Download individual files via the repository's web interface

### Step 2: Organize Files Locally

Place the downloaded files in the `public/apps/` directory:

```bash
public/apps/
└── YourApp/
    ├── city_app.yml        # Downloaded from repository
    └── modules/
        ├── module1.yml     # Downloaded from repository
        ├── module2.yml     # Downloaded from repository
        └── module3.yml     # Downloaded from repository
```

### Step 3: Adjust the city_app.yml File

**Important:** You need to replace the remote Git URLs in the `city_app.yml` file with local file paths.

**Before (Remote URLs):**
```yaml
name: "My Smart City App"
provider: "Your Organization"
# ... other fields ...

modules:
  - "https://github.com/user/repo/blob/main/modules/module1.yml"
  - "https://gitlab.opencode.de/group/project/-/blob/main/modules/module2.yml"
  - "https://github.com/user/repo/blob/main/modules/module3.yml"
```

**After (Local Paths):**
```yaml
name: "My Smart City App"
provider: "Your Organization"
# ... other fields ...

modules:
  - "/apps/YourApp/modules/module1.yml"
  - "/apps/YourApp/modules/module2.yml"
  - "/apps/YourApp/modules/module3.yml"
```

### Step 4: Update the Manifest

Update `public/apps/manifest.json` to point to your local `city_app.yml`:

```json
{
  "apps": [
    {
      "name": "YourApp",
      "app_yml_url": "/apps/YourApp/city_app.yml"
    }
  ]
}
```

### Step 5: Verify Everything Works

1. Clear the application cache:
   - Open browser console (F12)
   - Run: `window.clearYamlCache()`

2. Refresh the page

3. Check the browser console for messages like:
   ```
   Local URL detected, no proxy needed: /apps/YourApp/city_app.yml
   Successfully loaded app: YourApp
   ```

## Deployment with Local Files

When deploying the application with local YAML files, only the frontend needs to be deployed. No proxy server is required.

### Build the Application

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy

Deploy the `dist/` folder to any static hosting service:

- **Docker**: Use the provided Dockerfile
- **Netlify/Vercel**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **Traditional hosting**: Upload the `dist/` folder contents

The application will work with local YAML files without any backend or proxy server.

## Troubleshooting

### Application Not Loading

1. **Check the Browser Console** (F12)
   - Look for error messages
   - Verify the manifest is loading correctly
   - Check that YAML files are being fetched

2. **Verify File Paths**
   - Ensure paths in `manifest.json` start with `/apps/`
   - Check that file names match exactly (case-sensitive)
   - Use forward slashes `/` not backslashes `\\`

3. **Validate YAML Syntax**
   - Use an online YAML validator: https://www.yamllint.com/
   - Check for proper indentation (use spaces, not tabs)
   - Ensure strings with special characters are quoted

4. **Converting from Remote to Local**
   - If you downloaded files from a Git repository, remember to update the `city_app.yml` file
   - Replace all remote Git URLs in the `modules` array with local paths
   - See the [Converting Remote Files to Local Storage](#converting-remote-files-to-local-storage) section for detailed instructions

### Module Not Appearing

1. **Check Module Paths in `city_app.yml`**
   - Verify the module is listed in the `modules` array
   - Ensure the path is correct and points to an existing file
   - Example: `/apps/MyApp/modules/mymodule.yml`

2. **Check Module YAML Syntax**
   - Validate the YAML file
   - Ensure all required fields are present
   - Check for typos in field names

### Cache Issues

If you modify YAML files but don't see changes:

1. **Clear the Application Cache**
   - Open browser console (F12)
   - Run: `window.clearYamlCache()`
   - Refresh the page

2. **Hard Refresh**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Press `Cmd+Shift+R` (Mac)

3. **Clear Browser Storage**
   - Open DevTools (F12) → Application → Storage
   - Clear Local Storage
   - Clear Cache Storage

### Port Already in Use

If port 5173 is already in use:

```bash
# Specify a different port
npm start -- --port 3000
```

### Permission Errors

If you get permission errors when creating files:

```bash
# Windows (run as Administrator)
# Linux/Mac
sudo chown -R $USER:$USER public/apps/
```

## Additional Resources

- [Main README](../README.md) - General application documentation
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [SCA Proxy README](../sca-proxy/README.md) - Proxy server setup for remote Git repositories

## Need Help?

If you encounter issues not covered in this guide:

1. Check existing [GitHub Issues](https://github.com/adelinerd/sca-modulecatalogue/issues)
2. Create a new issue with:
   - Description of the problem
   - Browser console logs
   - Your `manifest.json` and YAML files (if applicable)
   - Steps to reproduce
