const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Import routes
const parkingRoutes = require('./routes/parking');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'https://parking-system-monitor.vercel.app',
      'https://parking-system-monitor-git-main.vercel.app',
      'https://parking-mornitoring-github-io.vercel.app',
      'https://parking-mornitoring-github-hfsnn4uxq-golfs-projects-ada858e6.vercel.app',
      'https://parking-mornitoring-github-ex4epk3mh-golfs-projects-ada858e6.vercel.app',
      'https://parking-mornitoring-github-6yq2s85c3-golfs-projects-ada858e6.vercel.app'
    ];
    
    // Check if origin is in allowed list or is a Vercel app
    if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      return callback(null, true);
    }
    
    console.log(`❌ CORS blocked for origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parking System API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/parking', parkingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Serve static files from React build (only for local production)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Start server (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚗 Parking System Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  });
}

module.exports = app;
