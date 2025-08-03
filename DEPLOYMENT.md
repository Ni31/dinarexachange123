# Production Deployment Guide

This guide covers deploying the Dinar Exchange application to production.

## Pre-Deployment Checklist

### 1. Environment Configuration
- [ ] Copy `.env.production` and update with production values
- [ ] Set secure `NEXTAUTH_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI (MongoDB Atlas recommended)
- [ ] Set correct `NEXTAUTH_URL` to your domain
- [ ] Configure email service (Resend API key)
- [ ] Remove or secure development-only environment variables

### 2. Security Review
- [ ] Verify all secrets are properly configured
- [ ] Ensure no sensitive data in client-side code
- [ ] Review and test authentication flows
- [ ] Validate admin role permissions
- [ ] Test rate limiting and security headers

### 3. Performance Optimization
- [ ] Run `npm run build:production` to test build
- [ ] Optimize images and assets
- [ ] Review bundle size with `npm run build:analyze`
- [ ] Test with production database

### 4. Database Setup
- [ ] Set up production MongoDB database
- [ ] Run admin seeding: `npm run seed-admin:production`
- [ ] Configure database backups
- [ ] Set up monitoring and alerts

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Deploy**
   ```bash
   npm run deploy:vercel
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build:production
   EXPOSE 3000
   CMD ["npm", "run", "start:production"]
   ```

2. **Build and Run**
   ```bash
   docker build -t dinar-exchange .
   docker run -p 3000:3000 --env-file .env.production dinar-exchange
   ```

### Option 3: Traditional Server

1. **Server Requirements**
   - Node.js 18+
   - PM2 for process management
   - Nginx for reverse proxy
   - SSL certificate

2. **Deploy Steps**
   ```bash
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build:production
   
   # Start with PM2
   pm2 start npm --name "dinar-exchange" -- run start:production
   ```

## Post-Deployment

### 1. Health Checks
```bash
# Run health check
npm run health-check

# Test critical endpoints
curl https://yourdomain.com/api/health
curl https://yourdomain.com/admin/login
```

### 2. Monitoring Setup
- [ ] Set up application monitoring (Sentry, LogRocket)
- [ ] Configure uptime monitoring
- [ ] Set up database monitoring
- [ ] Configure error alerting

### 3. Performance Testing
- [ ] Load testing with realistic traffic
- [ ] Database performance under load
- [ ] CDN and caching verification
- [ ] Mobile performance testing

## Environment Variables Reference

### Required Production Variables
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
NEXTAUTH_SECRET=your-32-char-secret-key
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

### Optional Production Variables
```env
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
SENTRY_DSN=your-sentry-dsn
```

## Security Best Practices

1. **Environment Security**
   - Never commit `.env` files
   - Use different secrets for each environment
   - Rotate secrets regularly

2. **Database Security**
   - Use MongoDB Atlas with IP whitelisting
   - Enable database authentication
   - Regular security updates

3. **Application Security**
   - Keep dependencies updated
   - Use HTTPS everywhere
   - Implement proper CORS policies

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **Database Connection Issues**
   ```bash
   # Test MongoDB connection
   npm run test:production
   ```

3. **Authentication Problems**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches domain
   - Ensure admin user exists in database

### Logs and Debugging

```bash
# View application logs
pm2 logs dinar-exchange

# Check health status
npm run health-check

# Database connection test
node -e "require('./lib/mongodb.js').default().then(() => console.log('DB OK'))"
```

## Rollback Procedure

1. **Vercel Rollback**
   ```bash
   vercel rollback [deployment-url]
   ```

2. **Docker Rollback**
   ```bash
   docker run previous-image-tag
   ```

3. **Traditional Server**
   ```bash
   pm2 stop dinar-exchange
   # Restore previous version
   pm2 start dinar-exchange
   ```

## Support

For deployment issues:
1. Check this guide first
2. Review application logs
3. Run health checks
4. Contact development team with specific error messages