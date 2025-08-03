// Health check endpoint for Vercel deployment monitoring
import dbConnect from '../../lib/mongodb';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error', 
      message: 'Method not allowed' 
    });
  }

  try {
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      vercel_env: process.env.VERCEL_ENV || 'local',
      checks: {
        database: 'checking...',
        environment: 'checking...',
        memory: 'checking...'
      }
    };

    // Check database connection
    try {
      await dbConnect();
      healthCheck.checks.database = 'connected';
    } catch (dbError) {
      healthCheck.checks.database = 'failed';
      healthCheck.status = 'unhealthy';
      console.error('Database health check failed:', dbError.message);
    }

    // Check required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    
    if (missingEnvVars.length === 0) {
      healthCheck.checks.environment = 'configured';
    } else {
      healthCheck.checks.environment = `missing: ${missingEnvVars.join(', ')}`;
      healthCheck.status = 'unhealthy';
    }

    // Check memory usage (basic check)
    try {
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      healthCheck.checks.memory = `${memUsageMB}MB used`;
      
      // Flag if memory usage is very high (>500MB)
      if (memUsageMB > 500) {
        healthCheck.checks.memory += ' (high)';
      }
    } catch (memError) {
      healthCheck.checks.memory = 'unavailable';
    }

    // Set appropriate HTTP status code
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503;
    
    // Add cache headers to prevent caching of health checks
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(statusCode).json(healthCheck);
    
  } catch (error) {
    console.error('Health check error:', error);
    
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}

// Export config for Vercel
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};