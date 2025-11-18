# SCA-Modulbibliothek

**SCA-Modulbibliothek** (Smart City Apps Module Catalogue) is a web-based catalog that showcases reusable modules extracted from open source Smart City applications. It provides an interactive interface to explore, understand, and evaluate building blocks for Smart City software projects.

## Features

- Browse modules from various Smart City applications (DorfFunk, Smart Village App, Smart City Platform, etc.)
- Multi-language support (i18n) with automatic language detection
- Interactive filtering and search capabilities
- Detailed module information including technical specifications and metadata
- YAML-based module definitions with JSON schema validation
- Responsive design with Bootstrap 5 and modern UI components

## 📁 Project Structure

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
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Root React component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── package.json           # Project dependencies
├── LICENSE                # Apache 2.0 license
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # This file
```

## 🚀 Getting Started

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

3. Start the development server:
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

- **Frontend Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Bootstrap 5.3.2
- **Internationalization**: i18next with browser language detection
- **Data Format**: YAML with JSON Schema validation
- **Icons**: Lucide React
- **Code Quality**: ESLint with TypeScript support

## Usage

### Browsing Modules

The catalogue displays modules from multiple Smart City applications. Each module includes:
- Functional description and purpose
- Technical specifications
- Source application information
- Reusability indicators

### Adding New Modules

Module definitions are stored as YAML files in `public/apps/[app-name]/modules/`. Each module file should follow the JSON schema defined in `src/schemas/`.

**Steps to add a new module:**

1. Create a new YAML file in the appropriate app directory: `public/apps/[app-name]/modules/your-module.yml`
2. Follow the schema structure for module definitions
3. Ensure all required fields are populated
4. Test locally before submitting

Example module structure:
```yaml
name: "Module Name"
description: "Module description"
# ... additional fields per schema
```

### Adding New Applications

To add a new Smart City application:

1. Create a new directory under `public/apps/[new-app-name]/`
2. Add a `city_app.yml` file with application metadata
3. Create a `modules/` subdirectory for module definitions
4. Add module YAML files following the schema

### Internationalization

The application supports multiple languages. Language files are located in `src/i18n/`. The browser language detector automatically selects the appropriate language.

To add a new language:
1. Create a new language file in `src/i18n/locales/`
2. Register the language in the i18next configuration
3. Translate all keys from the reference language file

## Development

### Project Configuration

The project uses:
- **Vite** for fast development and optimized builds
- **TypeScript** for type safety
- **ESLint** for code quality
- **Bootstrap 5** for responsive UI components

### Proxy Configuration

The development server includes a proxy for GitLab API requests:
- `/gitlab` proxies to `https://gitlab.opencode.de`
- This allows fetching module data from GitLab repositories during development

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, optimized for production deployment.

## Deployment

The application is a static site that can be deployed to any static hosting service:

- **GitHub Pages**: Configure with GitHub Actions
- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Import the project for serverless deployment
- **Traditional hosting**: Upload the `dist/` folder contents

Ensure the hosting service supports client-side routing for single-page applications.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit improvements, report bugs, and request features.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project showcases modules from various open source Smart City applications:
- **DorfFunk** - Community communication platform
- **Smart Village App** - Village/town information and services
- **Smart City Platform** - Urban management and citizen engagement
- **Fraunhofer Module Library** - Reference module implementations

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
