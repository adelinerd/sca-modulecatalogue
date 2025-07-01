# Deployment Guide

This document describes how to deploy the SCA Modulbibliothek application using the GitLab CI/CD pipeline.

## Prerequisites

Before deploying, ensure you have:

1. **GitLab Repository**: Your code is hosted on GitLab
2. **Server Access**: SSH access to your deployment servers
3. **Environment Variables**: Required variables configured in GitLab

## GitLab CI/CD Variables

Configure the following variables in your GitLab project settings (`Settings > CI/CD > Variables`):

### Staging Environment
- `STAGING_SSH_PRIVATE_KEY`: SSH private key for staging server access
- `STAGING_HOST`: Staging server hostname or IP
- `STAGING_USER`: SSH username for staging server
- `STAGING_PATH`: Path on staging server where files should be deployed
- `STAGING_URL`: Public URL of the staging environment

### Production Environment
- `PRODUCTION_SSH_PRIVATE_KEY`: SSH private key for production server access
- `PRODUCTION_HOST`: Production server hostname or IP
- `PRODUCTION_USER`: SSH username for production server
- `PRODUCTION_PATH`: Path on production server where files should be deployed
- `PRODUCTION_URL`: Public URL of the production environment

## Pipeline Stages

### 1. Install Dependencies
- Installs npm packages
- Caches node_modules for faster subsequent builds

### 2. Lint
- Runs ESLint to check code quality
- Fails if linting errors are found

### 3. Build
- Builds the React application using Vite
- Creates optimized production bundle in `dist/` folder

### 4. Test
- Placeholder for running tests
- Currently just echoes a message (add actual tests as needed)

### 5. Deploy
- **Staging**: Deploys to staging environment when pushing to `develop` branch
- **Production**: Deploys to production when pushing to `main` branch
- **GitLab Pages**: Alternative deployment option for GitLab Pages

## Deployment Process

### Automatic Triggers
- **Merge Requests**: Runs install, lint, build, and test stages
- **Develop Branch**: Runs all stages, staging deployment available manually
- **Main Branch**: Runs all stages, production deployment available manually

### Manual Deployment
Both staging and production deployments are set to `when: manual`, meaning they require manual approval in the GitLab interface.

To deploy:
1. Go to your GitLab project
2. Navigate to `CI/CD > Pipelines`
3. Click on the pipeline for your commit
4. Click the "play" button next to the deployment job you want to run

## Server Setup

### Web Server Configuration
Ensure your web server (nginx, Apache, etc.) is configured to:
1. Serve static files from the deployment path
2. Handle client-side routing (redirect all routes to index.html)
3. Set appropriate cache headers for static assets

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/deployment/folder;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## GitLab Pages Deployment

As an alternative to custom server deployment, you can use GitLab Pages:

1. The pipeline includes a `pages` job that prepares the build for GitLab Pages
2. This job runs manually on the `main` branch
3. Your site will be available at `https://username.gitlab.io/repository-name`

## Monitoring and Rollback

### Monitoring
- Check deployment logs in GitLab CI/CD interface
- Monitor application performance and errors
- Set up health checks for your deployed application

### Rollback
If a deployment fails or causes issues:
1. Identify the last working commit
2. Create a new pipeline from that commit
3. Deploy the working version
4. Investigate and fix the issues in a separate branch

## Security Considerations

1. **SSH Keys**: Store SSH private keys as protected variables in GitLab
2. **Server Access**: Limit SSH access to deployment user only
3. **File Permissions**: Ensure proper file permissions on deployed files
4. **HTTPS**: Always use HTTPS in production
5. **Environment Variables**: Never commit sensitive data to the repository

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**
   - Verify SSH key is correct and has proper permissions
   - Check if server hostname/IP is accessible
   - Ensure SSH user has write permissions to deployment path

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are properly listed in package.json
   - Review build logs for specific error messages

3. **Deployment Path Issues**
   - Ensure deployment path exists on server
   - Check file permissions and ownership
   - Verify web server configuration points to correct path

For additional help, check the GitLab CI/CD documentation or contact your system administrator.