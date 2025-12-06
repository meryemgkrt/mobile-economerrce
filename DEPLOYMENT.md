# Deployment Guide

This guide provides detailed instructions for deploying the Mobile E-Commerce application to various platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Deployment Options](#deployment-options)
  - [Render.com (Recommended)](#rendercom-recommended)
  - [Docker Deployment](#docker-deployment)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [Vercel (Admin Panel Only)](#vercel-admin-panel-only)

## Prerequisites

- Git repository hosted on GitHub
- Node.js 20.x or higher
- Database connection URL (if using a database)

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `production` |
| `PORT` | Server port | No | `10000` |
| `DB_URL` | Database connection string | Yes* | - |

*Required only if using database features

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

## Deployment Options

### Render.com (Recommended)

Render provides free hosting with automatic deployments from GitHub.

#### Steps:

1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Connect to Render:**
   - Sign up at [render.com](https://render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub account
   - Select your repository

3. **Configure the blueprint:**
   - Render will automatically detect `render.yaml`
   - Review the configuration
   - Click "Apply"

4. **Set environment variables:**
   - In the Render dashboard, go to your service
   - Navigate to "Environment"
   - Add `DB_URL` and any other sensitive variables
   - Save changes

5. **Deploy:**
   - Render will automatically build and deploy
   - Your app will be live at the provided URL (e.g., `https://your-app.onrender.com`)
   - Health check endpoint: `https://your-app.onrender.com/api/health`

#### Automatic Deployments:

Render will automatically redeploy on every push to your main branch.

#### Free Tier Limitations:

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- 750 hours/month of runtime

### Docker Deployment

Deploy using Docker to any container platform (AWS ECS, Google Cloud Run, Azure Container Instances, etc.)

#### Build Docker Image:

```bash
docker build -t mobile-ecommerce:latest .
```

#### Run Locally:

```bash
docker run -p 10000:10000 \
  -e NODE_ENV=production \
  -e DB_URL=your_database_url \
  mobile-ecommerce:latest
```

#### Push to Registry:

```bash
# Docker Hub
docker tag mobile-ecommerce:latest username/mobile-ecommerce:latest
docker push username/mobile-ecommerce:latest

# Google Container Registry
docker tag mobile-ecommerce:latest gcr.io/project-id/mobile-ecommerce:latest
docker push gcr.io/project-id/mobile-ecommerce:latest

# AWS ECR
docker tag mobile-ecommerce:latest aws_account_id.dkr.ecr.region.amazonaws.com/mobile-ecommerce:latest
docker push aws_account_id.dkr.ecr.region.amazonaws.com/mobile-ecommerce:latest
```

### Heroku

Deploy to Heroku using Git.

#### Steps:

1. **Install Heroku CLI:**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Create a new app:**
   ```bash
   heroku create your-app-name
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DB_URL=your_database_url
   ```

5. **Add buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

6. **Create a Procfile:**
   ```bash
   echo "web: npm start" > Procfile
   ```

7. **Deploy:**
   ```bash
   git add Procfile
   git commit -m "Add Procfile for Heroku"
   git push heroku main
   ```

8. **Open your app:**
   ```bash
   heroku open
   ```

### Railway

Deploy to Railway with automatic builds from GitHub.

#### Steps:

1. **Sign up at [railway.app](https://railway.app)**

2. **Create new project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure build:**
   - Railway will auto-detect Node.js
   - Set custom build command: `npm run install:all && npm run build`
   - Set start command: `npm start`

4. **Set environment variables:**
   - Go to Variables tab
   - Add `NODE_ENV`, `PORT`, and `DB_URL`

5. **Deploy:**
   - Railway will automatically build and deploy
   - Your app will be live at the provided URL

### Vercel (Admin Panel Only)

Vercel is ideal for deploying just the admin panel as a static site.

#### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy admin panel:**
   ```bash
   cd admin
   vercel
   ```

4. **Configure:**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

**Note:** This only deploys the admin panel. You'll need to deploy the backend separately and update API endpoints.

## Post-Deployment

### Verify Deployment:

1. **Health check:**
   ```bash
   curl https://your-app-url.com/api/health
   ```
   Expected response: `{"message":"Merhaba kod çalıştı!:))"}`

2. **Admin panel:**
   Visit `https://your-app-url.com` in your browser

### Monitor Logs:

- **Render:** Dashboard → Logs
- **Heroku:** `heroku logs --tail`
- **Railway:** Dashboard → Deployments → View Logs
- **Docker:** `docker logs <container-id>`

### Custom Domain:

Most platforms support custom domains:
- Add your domain in the platform dashboard
- Update DNS records as instructed
- Enable SSL (usually automatic)

## Troubleshooting

### Build Fails:

- Verify Node.js version is 20.x or higher
- Check that all dependencies are listed in package.json
- Review build logs for specific errors

### Server Won't Start:

- Verify environment variables are set correctly
- Check that PORT is available
- Review application logs

### Admin Panel Not Loading:

- Verify admin panel was built successfully (`admin/dist` exists)
- Check server is serving static files correctly
- Review network requests in browser DevTools

### Database Connection Issues:

- Verify DB_URL is correct
- Check database allows connections from your deployment platform's IPs
- Ensure database is running and accessible

## Continuous Deployment

### GitHub Actions:

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Runs on push to main/master branch
- Installs dependencies
- Builds the application
- Tests the health endpoint

Deployment to production can be triggered automatically through platform integrations:
- Render: Automatic on push
- Heroku: Use Heroku GitHub integration
- Railway: Automatic on push
- Vercel: Automatic on push

## Security Best Practices

1. **Never commit sensitive data:**
   - Keep `.env` in `.gitignore`
   - Use platform environment variables for secrets

2. **Use HTTPS:**
   - Most platforms provide automatic SSL
   - Ensure your custom domain uses HTTPS

3. **Update dependencies regularly:**
   ```bash
   npm audit
   npm update
   ```

4. **Monitor your application:**
   - Set up error tracking (Sentry, LogRocket, etc.)
   - Monitor performance and uptime

## Support

For deployment issues:
- Check platform documentation
- Review application logs
- Open an issue on GitHub
