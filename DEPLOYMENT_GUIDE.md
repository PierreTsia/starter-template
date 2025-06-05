# Backend Deployment Guide for Render

This guide walks you through deploying the NestJS backend to Render, including database setup and environment configuration.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com))
- Your code pushed to a Git repository (GitHub, GitLab, etc.)
- Basic understanding of PostgreSQL and environment variables

## Step 1: Create a PostgreSQL Database

1. Go to your Render dashboard
2. Click "New +" and select "PostgreSQL"
3. Configure the database:

   - Name: `starter_template_db` (or your preferred name)
   - Database: `starter_template_db`
   - User: `starter_template_user`
   - Region: Choose the same as your web service
   - Plan: Free (or your preferred plan)

4. After creation, note down:
   - Internal Database URL (for services within Render)
   - External Database URL (for local development)
   - Username
   - Password

## Step 2: Create a Web Service

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your repository
4. Configure the service:

   **Basic Settings:**

   - Name: `nestjs-api` (or your preferred name)
   - Environment: `Node`
   - Region: Same as your database
   - Branch: `main` (or your deployment branch)
   - Root Directory: Leave blank (it's a monorepo)

   **Build & Start:**

   - Build Command:
     ```bash
     pnpm install --no-frozen-lockfile && cd apps/api && pnpm prisma generate && pnpm prisma migrate deploy && pnpm nest build --webpack && ls -la dist
     ```
   - Start Command:
     ```bash
     cd apps/api && pnpm deploy:start
     ```

   **Environment Variables:**

   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Use the Internal Database URL from your PostgreSQL service
   - `JWT_SECRET`: Generate a secure random string (you can use `openssl rand -base64 32`)

   **Health Check:**

   - Path: `/api/v1/health`

## Step 3: Verify Deployment

1. Wait for the first deployment to complete
2. Check the logs for any errors
3. Test the API endpoints:
   - Health check: `https://your-service.onrender.com/api/v1/health`
   - Root endpoint: `https://your-service.onrender.com/api/v1`

## Common Issues and Solutions

### Database Connection Issues

- Verify the `DATABASE_URL` is correct
- Check if the database is in the same region as the web service
- Ensure the database is fully provisioned before deploying

### Build Failures

- Check if all dependencies are properly installed
- Verify the Prisma schema is valid
- Look for TypeScript compilation errors

### Runtime Errors

- Check the application logs in Render
- Verify all environment variables are set
- Ensure the database migrations have run successfully

## Maintenance

### Updating the Application

1. Push changes to your repository
2. Render will automatically deploy if auto-deploy is enabled
3. Monitor the deployment logs for any issues

### Database Migrations

- New migrations will run automatically during deployment
- If you need to run migrations manually:
  ```bash
  cd apps/api
  pnpm prisma migrate deploy
  ```

### Environment Variables

- Update them in the Render dashboard under your service's "Environment" tab
- Changes require a redeployment to take effect

## Monitoring

- Use Render's built-in logging
- Set up alerts for:
  - Failed deployments
  - High error rates
  - Service unavailability

## Security Considerations

1. Keep your `JWT_SECRET` secure and rotate it periodically
2. Use the Internal Database URL for production
3. Enable HTTPS (automatic with Render)
4. Regularly update dependencies
5. Monitor for suspicious activity

## Troubleshooting

### Service Won't Start

1. Check the build logs
2. Verify environment variables
3. Ensure the database is accessible
4. Check if the port is correctly configured

### Database Issues

1. Verify database credentials
2. Check if the database is running
3. Look for connection errors in logs
4. Ensure migrations have run successfully

### API Not Responding

1. Check if the service is running
2. Verify the health check endpoint
3. Look for any error logs
4. Check if the database is accessible

## Support

- Render Documentation: [render.com/docs](https://render.com/docs)
- NestJS Documentation: [docs.nestjs.com](https://docs.nestjs.com)
- Prisma Documentation: [prisma.io/docs](https://prisma.io/docs)

## Notes

- The free tier of Render will spin down after 15 minutes of inactivity
- Database backups are recommended for production
- Consider setting up monitoring and alerting for production deployments

---

# Frontend Deployment Guide for Vercel

This guide covers deploying the React frontend to Vercel, including environment configuration and API integration.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, etc.)
- Your backend API deployed and accessible

## Step 1: Create a Vercel Project

1. Go to your Vercel dashboard
2. Click "Add New..." and select "Project"
3. Import your repository
4. Configure the project:

   **Basic Settings:**

   - Framework Preset: `Vite`
   - Root Directory: `apps/web` (for monorepo setup)
   - Build Command: `cd ../.. && pnpm install --no-frozen-lockfile && cd apps/web && pnpm build`
   - Output Directory: `dist`
   - Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`

## Step 2: Configure Environment Variables

Add the following environment variables in Vercel's project settings:

- `VITE_API_URL`: Your Render backend URL (e.g., `https://your-api.onrender.com`)
- `VITE_APP_ENV`: `production`
- Any other environment variables your frontend needs

## Step 3: Configure Build Settings

1. Go to your project settings in Vercel
2. Under "Build & Development Settings":
   - Framework Preset: `Vite`
   - Build Command: `cd ../.. && pnpm install --no-frozen-lockfile && cd apps/web && pnpm build`
   - Output Directory: `dist`
   - Install Command: `cd ../.. && pnpm install --no-frozen-lockfile`

## Step 4: Configure Domain (Optional)

1. Go to your project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS settings

## Common Issues and Solutions

### Build Failures

- Check if all dependencies are properly installed
- Verify the Vite configuration
- Look for TypeScript compilation errors
- Ensure the monorepo structure is correctly referenced

### API Connection Issues

- Verify the `VITE_API_URL` is correct
- Check CORS settings on the backend
- Ensure the backend is accessible from Vercel's deployment

### Environment Variables

- Verify all required variables are set
- Check if variables are properly prefixed with `VITE_`
- Ensure variables are available during build time

## Maintenance

### Updating the Application

1. Push changes to your repository
2. Vercel will automatically deploy if auto-deploy is enabled
3. Monitor the deployment logs for any issues

### Environment Variables

- Update them in the Vercel dashboard under your project's "Settings" tab
- Changes require a redeployment to take effect

## Performance Optimization

1. Enable Vercel's Edge Network
2. Configure caching headers
3. Enable automatic image optimization
4. Use Vercel's Analytics (optional)

## Security Considerations

1. Keep your environment variables secure
2. Enable HTTPS (automatic with Vercel)
3. Regularly update dependencies
4. Monitor for suspicious activity
5. Configure security headers

## Troubleshooting

### Build Issues

1. Check the build logs
2. Verify environment variables
3. Ensure all dependencies are correctly specified
4. Check for TypeScript errors

### Runtime Issues

1. Check the browser console for errors
2. Verify API connectivity
3. Check environment variables in production
4. Look for CORS issues

### Deployment Issues

1. Check Vercel's deployment logs
2. Verify build settings
3. Ensure correct monorepo configuration
4. Check for memory limits

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vite Documentation: [vitejs.dev/guide](https://vitejs.dev/guide)
- React Documentation: [react.dev](https://react.dev)

## Notes

- Vercel's free tier includes:
  - Automatic HTTPS
  - Global CDN
  - Continuous deployment
  - Preview deployments for PRs
- Consider enabling Vercel Analytics for monitoring
- Use Vercel's Edge Functions for serverless functions if needed
- Enable automatic preview deployments for better development workflow
