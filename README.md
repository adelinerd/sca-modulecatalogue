# SCA-Modulbibliothek

**SCA-Modulbibliothek** (Smart City Apps Module Catalogue) is a web-based catalog that showcases reusable modules extracted from open source Smart City applications. It provides an interactive interface to explore, understand, and evaluate building blocks for Smart City software projects.

## Features

- Browse modules from various Smart City applications (DorfFunk, Smart Village App, Smart City Platform, etc.)
- Load modules from local files or remote GitLab repositories
- Multi-language support (i18n) with automatic language detection
- Interactive filtering and search capabilities
- Detailed module information including technical specifications and metadata
- YAML-based module definitions with JSON schema validation
- Responsive design with Bootstrap 5 and modern UI components
- Secure CORS proxy server for fetching remote YAML files
- Client-side and server-side caching for improved performance

## Documentation

- **[Local Setup Guide](docs/LOCAL_SETUP.md)** - Run the app with locally stored files (no proxy server required)
- **[SCA Proxy README](sca-proxy/README.md)** - Setup guide for loading YAML from remote Git repositories
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## Project Structure

```
sca-modulecatalogue/
├── public/
│   └── apps/              # YAML module definitions organized by app
│       ├── DorfFunk/
│       ├── SmartVillageApp/
│       ├── Smart-City-Platform/
│       └── fraunhofer-modulbibliothek/
├── src/
│   ├── components/        # React UI components
│   ├── hooks/             # Custom React hooks (e.g., useAppData)
│   ├── i18n/              # Internationalization (i18next) language files
│   ├── schemas/           # JSON Schema files for YAML validation
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions (cache, YAML loader with proxy support)
│   ├── App.tsx            # Root React component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── sca-proxy/             # CORS proxy server for GitLab YAML files
│   ├── server.ts          # Express server with rate limiting and security
│   ├── package.json       # Proxy dependencies
│   ├── .env.example       # Environment configuration template
│   └── README.md          # Proxy documentation
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies
├── .env.example           # Environment variables template
├── LICENSE                # Apache 2.0 license
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adelinerd/sca-modulecatalogue.git
cd sca-modulecatalogue
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional, required for remote GitLab YAML loading):
```bash
cp .env.example .env
```
Edit [.env](.env) and set `VITE_YAML_PROXY_SERVER` to your proxy server URL (default: `http://localhost:8080/api/yaml`).

4. Set up the proxy server (required for loading YAML files from GitLab):
```bash
cd sca-proxy
npm install
cp .env.example .env
```
Edit [sca-proxy/.env](sca-proxy/.env) and configure your GitLab instances and tokens. See the [SCA Proxy README](sca-proxy/README.md) for details.

5. Start the proxy server (in a separate terminal):
```bash
cd sca-proxy
npm run dev
```

6. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:5173` (default Vite port).

### Available Scripts

- `npm start` or `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Technology Stack

### Frontend
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Bootstrap 5.3.2
- **Internationalization**: i18next with browser language detection
- **Data Format**: YAML with JSON Schema validation
- **Icons**: Lucide React
- **Code Quality**: ESLint with TypeScript support

### Backend (Proxy Server)
- **Runtime**: Node.js v18+
- **Framework**: Express 5.2.1
- **Language**: TypeScript 5.7.2
- **HTTP Client**: Undici 7.16.0
- **Security**: Helmet (security headers), CORS protection
- **Rate Limiting**: rate-limiter-flexible 9.0.0
- **Validation**: Zod 4.1.13
- **Development**: tsx for TypeScript execution

## Usage

### Browsing Modules

The catalogue displays modules from multiple Smart City applications. Each module includes:
- Functional description and purpose
- Technical specifications
- Source application information
- Reusability indicators


### Adding New Applications

There are two ways to add applications to the catalogue:

**Option 1: Local Files (Recommended for Development)**

See the **[Local Setup Guide](docs/LOCAL_SETUP.md)** for a comprehensive tutorial on:
- Setting up local application files
- Creating YAML definitions
- Testing without a proxy server
- Troubleshooting common issues

**Option 2: Remote Git Repositories**

1. Edit the `public/manifest.json` file to add your application:
```json
{
  "name": "Your App Name",
  "app_yml_url": "https://github.com/user/repo/blob/main/city_app.yml"
}
```
2. For GitLab URLs, ensure the [SCA Proxy](sca-proxy/README.md) is configured and running
3. GitHub raw URLs work directly without proxy configuration

### Internationalization

The application supports multiple languages. Language files are located in [src/i18n/](src/i18n/). The browser language detector automatically selects the appropriate language.

To add a new language:
1. Create a new language file in [src/i18n/locales/](src/i18n/locales/)
2. Register the language in the i18next configuration
3. Translate all keys from the reference language file

### Caching

The application implements a two-tier caching system for YAML files:

1. **Memory Cache**: Fast in-memory storage for the current session
2. **LocalStorage Cache**: Persistent browser storage across sessions

**Cache debugging:**
- Open browser console and run: `window.clearYamlCache()` to clear all cached YAML data
- Run: `window.clearYamlCache('specific-url')` to clear a specific URL's cache
- Cache entries expire after the configured TTL period

## Development

### Project Configuration

The project uses:
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **ESLint** for code quality
- **Bootstrap 5** for responsive UI components

### Environment Variables

**Frontend ([.env](.env)):**
```env
VITE_YAML_PROXY_SERVER=http://localhost:8080/api/yaml
```

**Proxy Server ([sca-proxy/.env](sca-proxy/.env)):**
```env
# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-production-domain.com

# Server Configuration
PORT=8080

# GitLab Instances
GITLAB_OPEN_CODE=https://gitlab.opencode.de
GITLAB_OPEN_CODE_TOKEN=your-private-token-here
GITLAB_OSS_BASE=https://gitlab.com
GITLAB_OSS_TOKEN=your-personal-access-token-here
```

See [.env.example](.env.example) and [sca-proxy/.env.example](sca-proxy/.env.example) for complete configuration templates.

### SCA Proxy Server

The project includes a dedicated CORS proxy server ([sca-proxy/](sca-proxy/)) to enable fetching YAML files from GitLab repositories without CORS restrictions:

**Features:**
- Supports multiple GitLab instances (gitlab.opencode.de, gitlab.com, etc.)
- Rate limiting (60 requests/minute per IP)
- Security headers via Helmet
- ETag-based caching for improved performance
- Automatic blob-to-raw URL conversion
- Private token support for authenticated GitLab access

**Setup:**
1. Navigate to [sca-proxy/](sca-proxy/)
2. Install dependencies: `npm install`
3. Copy [.env.example](sca-proxy/.env.example) to `.env`
4. Configure your GitLab instances and tokens
5. Start the server: `npm run dev` (development) or `npm start` (production)

See [sca-proxy/README.md](sca-proxy/README.md) for detailed configuration options.

**Frontend Integration:**
- Set `VITE_YAML_PROXY_SERVER` in [.env](.env) to your proxy URL (default: `http://localhost:8080/api/yaml`)
- The [yamlLoader utility](src/utils/yamlLoader.ts) automatically routes GitLab URLs through the proxy
- Local files and GitHub raw URLs bypass the proxy

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, optimized for production deployment.

## Deployment

### Frontend Application

The application is a static site that can be deployed to any static hosting service:

- **GitHub Pages**: Configure with GitHub Actions
- **Netlify**: Connect your repository for automatic deployments
- **Traditional hosting**: Upload the `dist/` folder contents

Ensure the hosting service supports client-side routing for single-page applications.

### Proxy Server

The proxy server must be deployed separately to a Node.js hosting environment:

- **Docker**: Use the Dockerfile in [sca-proxy/](sca-proxy/) for containerized deployment

**Production considerations:**
1. Set environment variables for CORS origins and GitLab tokens
2. Enable HTTPS for secure token transmission
3. Configure rate limiting based on your expected traffic
4. Monitor server logs for errors and performance issues
5. Update the frontend `VITE_YAML_PROXY_SERVER` to point to your production proxy URL

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit improvements, report bugs, and request features.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project showcases modules from various open source Smart City applications:
- **DorfFunk** - Community communication platform developed by Fraunhofer IESE in context of "Digitale Dörfer" project
- **Smart Village App** - App for the city "Bad Belzig" developed by Smart Village Sollutions GmbH
- **URBO** - App for the City Soest, developed by  SWCode

## Third-Party Licenses

### Production Dependencies

* [@types/js-yaml (^4.0.9)](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/js-yaml) - MIT
* [bootstrap (^5.3.2)](https://getbootstrap.com) - MIT
* [i18next (^25.2.1)](https://www.i18next.com) - MIT
* [i18next-browser-languagedetector (^8.1.0)](https://github.com/i18next/i18next-browser-languageDetector) - MIT
* [js-yaml (^4.1.0)](https://github.com/nodeca/js-yaml#readme) - MIT
* [lucide-react (^0.511.0)](https://lucide.dev) - ISC
* [react (^19.1.0)](https://react.dev/) - MIT
* [react-dom (^19.1.0)](https://react.dev/) - MIT
* [react-i18next (^15.5.2)](https://github.com/i18next/react-i18next) - MIT

### Development Dependencies

* [@eslint/js (^9.27.0)](https://eslint.org) - MIT
* [@types/react (^19.1.6)](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react) - MIT
* [@types/react-dom (^19.1.5)](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom) - MIT
* [@vitejs/plugin-react (^4.5.0)](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react#readme) - MIT
* [eslint (^9.27.0)](https://eslint.org) - MIT
* [eslint-plugin-react-hooks (^5.2.0)](https://react.dev/) - MIT
* [eslint-plugin-react-refresh (^0.4.20)](https://github.com/ArnaudBarre/eslint-plugin-react-refresh#readme) - MIT
* [globals (^16.2.0)](https://github.com/sindresorhus/globals#readme) - MIT
* [typescript (^5.8.3)](https://www.typescriptlang.org/) - Apache-2.0
* [typescript-eslint (^8.33.0)](https://typescript-eslint.io/packages/typescript-eslint) - MIT
* [vite (^6.3.5)](https://vite.dev) - MIT
