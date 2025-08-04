# Vercel Deployment Fix Guide

This guide addresses common Vercel deployment issues and provides step-by-step solutions.

## 🚨 Common Deployment Issues & Fixes

### 1. Build Failures

**Issue**: Build fails during deployment
**Solutions**:

```bash
# Test build locally first
npm run build

# If build fails locally, fix errors before deploying
npm run lint:fix
```

### 2. Environment Variables

**Issue**: Missing or incorrect environment variables
**Solution**: Set these in Vercel Dashboard → Settings → Environment Variables

```env
# Required Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diner-exchange
NEXTAUTH_SECRET=your-32-character-secret
NEXTAUTH_URL=https://your-project.vercel.app
NODE_ENV=production
```

### 3. Database Connection Issues

**Issue**: Cannot connect to MongoDB
**Solutions**:

1. **Use MongoDB Atlas** (recommended for Vercel)
2. **Whitelist Vercel IPs** in MongoDB Atlas:
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow all) or specific Vercel IPs
3. **Check connection string format**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### 4. NextAuth Configuration Issues

**Issue**: Authentication not working in production
**Solutions**:

1. **Generate secure secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Set correct NEXTAUTH_URL**:
   ```env
   NEXTAUTH_URL=https://your-actual-domain.vercel.app
   ```

3. **Ensure middleware is properly configured**

### 5. API Route Issues

**Issue**: API routes returning 500 errors
**Solutions**:

1. **Check function timeout** (max 30s on Vercel)
2. **Verify database connections are properly closed**
3. **Check for memory leaks**

## 🛠️ Step-by-Step Deployment Process

### Step 1: Pre-Deployment Checklist

```bash
# 1. Test build locally
npm run build

# 2. Run linting
npm run lint

# 3. Test with production environment
cp .env.production .env.local
npm run dev
```

### Step 2: Environment Setup

1. **Create MongoDB Atlas Database**:
   - Sign up at [MongoDB Atlas](https://mongodb.com/atlas)
   - Create a new cluster
   - Create database user
   - Get connection string

2. **Generate Secure Secrets**:
   ```bash
   # Generate NEXTAUTH_SECRET
   openssl rand -base64 32
   ```

### Step 3: Vercel Configuration

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy using our script**:
   ```bash
   npm run deploy:vercel
   ```

### Step 4: Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-project.vercel.app
NODE_ENV=production
VERCEL_ENV=production
```

### Step 5: Post-Deployment

1. **Test the deployment**:
   - Visit your Vercel URL
   - Test admin login
   - Check API endpoints

2. **Seed admin data**:
   ```bash
   # Set environment variables first, then:
   npm run seed-admin:production
   ```

3. **Run health check**:
   ```bash
   npm run health-check
   ```

## 🔧 Troubleshooting Common Errors

### Error: "Module not found"
**Solution**: Check imports and ensure all dependencies are in package.json

### Error: "Cannot connect to database"
**Solution**: 
1. Check MongoDB Atlas network access
2. Verify connection string
3. Ensure database user has correct permissions

### Error: "NextAuth configuration error"
**Solution**:
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your domain
3. Ensure pages configuration is correct

### Error: "Function timeout"
**Solution**:
1. Optimize database queries
2. Add connection pooling
3. Check for infinite loops

## 📋 Production Checklist

- [ ] Local build successful
- [ ] Environment variables configured
- [ ] MongoDB Atlas setup complete
- [ ] Vercel project created
- [ ] Domain configured (if custom)
- [ ] SSL certificate active
- [ ] Admin user seeded
- [ ] Health checks passing
- [ ] Error monitoring setup

## 🆘 Getting Help

If you're still experiencing issues:

1. Check Vercel deployment logs
2. Review browser console for errors
3. Test API endpoints individually
4. Verify all environment variables are set
5. Check MongoDB Atlas logs

## 📞 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)