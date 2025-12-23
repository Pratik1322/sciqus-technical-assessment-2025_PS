const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const ResponseHandler = require('./utils/responseHandler');

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// CORS Configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Route
app.get('/health', (req, res) => {
  ResponseHandler.success(res, { status: 'OK', timestamp: new Date().toISOString() }, 'Service is running');
});

// API Routes
// TODO: Import and use your route files here
// Example: app.use('/api/v1/users', require('./routes/userRoutes'));

// 404 Handler
app.use((req, res) => {
  ResponseHandler.notFound(res, `Cannot ${req.method} ${req.originalUrl}`);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return ResponseHandler.validationError(res, err.details, err.message);
  }
  
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return ResponseHandler.unauthorized(res, 'Invalid or expired token');
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  ResponseHandler.error(
    res,
    process.env.NODE_ENV === 'production' ? 'An error occurred' : message,
    statusCode,
    process.env.NODE_ENV === 'production' ? null : { stack: err.stack }
  );
});

const PORT = process.env.PORT || 3000;

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
