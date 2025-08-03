# Vercel Deployment Guide

This guide covers deploying the Dinar Exchange application specifically to Vercel.

## 🚀 Quick Deployment

### Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a cloud database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Domain** (optional): For custom domain setup

### One-Click Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   npm run deploy:vercel
   ```

## 📋 Environment Variables Setup

### Required Variables (Set in Vercel Dashboard)

Go to your Vercel project → Settings → Environment Variables and add:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diner-exchange?retryWrites=true&w=majority

# Authentication
NEXTAUTH_SECRET=your-32-character-secure-secret-key
NEXTAUTH_URL=https://your-vercel-domain.vercel.app

# Environment
NODE_ENV=production
VERCEL_ENV=production

# Email (Optional)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
```

### Generate Secure Secret
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## 🔧 Vercel Configuration

The project includes optimized Vercel configuration:

- **vercel.json**: Platform-specific settings
- **next.config.mjs**: Vercel-optimized Next.js config
- **Standalone output**: Optimized for serverless functions

## 📊 Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://mongodb.com/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist Vercel IPs (or use 0.0.0.0/0 for all IPs)

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

### 3. Seed Admin Data
```bash
# After deployment, seed admin data
npm run seed-admin:production
```

## 🌐 Domain Configuration

### Custom Domain Setup
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable to your custom domain
4. Configure DNS records as instructed by Vercel

### SSL Certificate
Vercel automatically provides SSL certificates for all domains.

## 🔍 Deployment Steps

### Step 1: Prepare Environment
```bash
# Test build locally
npm run build

# Run health check
npm run health-check
```

### Step 2: Deploy to Preview
```bash
# Deploy to preview environment first
npm run deploy:preview
```

### Step 3: Deploy to Production
```bash
# Deploy to production
npm run deploy:vercel
```

### Step 4: Verify Deployment
1. Check deployment logs in Vercel dashboard
2. Test critical functionality:
   - Admin login: `https://your-domain.com/admin/login`
   - Health check: `https://your-domain.com/api/health`
   - User registration/login

## 📈 Performance Optimization

### Vercel Analytics (Optional)
1. Enable Vercel Analytics in dashboard
2. Add to your project:
   ```bash
   npm install @vercel/analytics
   ```

### Edge Functions
The application is optimized for Vercel's Edge Runtime where applicable.

## 🔧 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

#### 2. Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

#### 3. Environment Variable Issues
- Verify all required variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables

#### 4. Authentication Problems
- Ensure `NEXTAUTH_URL` matches your deployed domain
- Verify `NEXTAUTH_SECRET` is set and secure
- Check that admin user exists in database

### Debug Commands
```bash
# Check deployment logs
vercel logs your-deployment-url

# Test environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

## 🔄 CI/CD with GitHub

### Automatic Deployments
1. Connect your GitHub repository to Vercel
2. Enable automatic deployments
3. Set up branch protection rules

### Environment Variables per Branch
- **Production**: Set for production branch
- **Preview**: Set for development/staging branches
- **Development**: Use local `.env.local`

## 📊 Monitoring

### Vercel Dashboard
- Monitor function execution times
- Check error rates and logs
- Review performance metrics

### Health Checks
```bash
# Manual health check
curl https://your-domain.com/api/health

# Automated monitoring (set up external service)
# Examples: UptimeRobot, Pingdom, StatusCake
```

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files to version control
- Use different secrets for preview and production
- Rotate secrets regularly

### Database Security
- Use MongoDB Atlas with IP restrictions
- Enable database authentication
- Regular security updates

### Application Security
- HTTPS is enforced by default on Vercel
- Security headers are configured in `vercel.json`
- Regular dependency updates

## 💰 Cost Optimization

### Vercel Pricing
- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for commercial use
- **Enterprise**: Custom pricing

### MongoDB Atlas Pricing
- **Free Tier**: 512MB storage (good for development)
- **Shared Clusters**: Starting at $9/month
- **Dedicated Clusters**: Starting at $57/month

## 📞 Support

### Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

### Getting Help
1. Check Vercel deployment logs
2. Review this deployment guide
3. Check the main `DEPLOYMENT.md` for general issues
4. Contact development team with specific error messages

---

**Ready to Deploy**: Your application is fully configured for Vercel deployment! 🚀