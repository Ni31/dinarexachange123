// Health Check Script for Production Monitoring
import dbConnect from '../lib/mongodb.js';
import mongoose from 'mongoose';

async function healthCheck() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: { status: 'unknown' },
      environment: { status: 'unknown' },
      memory: { status: 'unknown' }
    }
  };

  try {
    // Check database connection
    await dbConnect();
    if (mongoose.connection.readyState === 1) {
      checks.checks.database = { 
        status: 'healthy',
        message: 'Database connected successfully'
      };
    } else {
      throw new Error('Database not connected');
    }
  } catch (error) {
    checks.checks.database = {
      status: 'unhealthy',
      message: error.message
    };
    checks.status = 'unhealthy';
  }

  // Check environment variables
  const requiredEnvVars = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    checks.checks.environment = {
      status: 'healthy',
      message: 'All required environment variables are set'
    };
  } else {
    checks.checks.environment = {
      status: 'unhealthy',
      message: `Missing environment variables: ${missingVars.join(', ')}`
    };
    checks.status = 'unhealthy';
  }

  // Check memory usage
  const memUsage = process.memoryUsage();
  const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  
  if (memUsageMB < 512) { // Less than 512MB
    checks.checks.memory = {
      status: 'healthy',
      usage: `${memUsageMB}MB`,
      message: 'Memory usage is normal'
    };
  } else {
    checks.checks.memory = {
      status: 'warning',
      usage: `${memUsageMB}MB`,
      message: 'High memory usage detected'
    };
  }

  // Output results
  console.log(JSON.stringify(checks, null, 2));
  
  // Exit with appropriate code
  process.exit(checks.status === 'healthy' ? 0 : 1);
}

// Run health check
healthCheck().catch(error => {
  console.error('Health check failed:', error);
  process.exit(1);
});