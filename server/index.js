console.log('[BOOT] index.js start');
process.on('uncaughtException', (e) => { console.error('[FATAL uncaughtException]', e); });
process.on('unhandledRejection', (e) => { console.error('[FATAL unhandledRejection]', e); });
console.log('[BOOT] requiring express');
const express = require('express');
console.log('[BOOT] express OK');
console.log('[BOOT] requiring mongoose');
const mongoose = require('mongoose');
console.log('[BOOT] mongoose OK');
console.log('[BOOT] requiring cors');
const cors = require('cors');
console.log('[BOOT] cors OK');
console.log('[BOOT] requiring helmet');
const helmet = require('helmet');
console.log('[BOOT] helmet OK');
console.log('[BOOT] requiring rateLimit');
const rateLimit = require('express-rate-limit');
console.log('[BOOT] rateLimit OK');
console.log('[BOOT] requiring session');
const session = require('express-session');
console.log('[BOOT] session OK');
console.log('[BOOT] requiring connect-mongo');
const MongoStore = require('connect-mongo');
console.log('[BOOT] connect-mongo OK');
require('dotenv').config();
console.log('[BOOT] dotenv loaded, PORT=', process.env.PORT);

console.log('[BOOT] requiring routes');
const coreRoutes = require('./routes/core');
console.log('[BOOT] coreRoutes OK');

const app = express();
console.log('[BOOT] Express created');
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
console.log('[BOOT] Helmet set');

// Rate limiting - increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs (increased for dev)
});
app.use(limiter);
console.log('[BOOT] Rate limiter set');

// CORS configuration - Allow multiple origins for development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177',
  'http://127.0.0.1:5178',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
console.log('[BOOT] CORS set');

// Body parsing (global) with guard
app.use(express.json({ limit: '1mb' }));
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON payload', code: 'BAD_JSON' });
  }
  return next(err);
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'green-points-session-secret-2024',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/green-points',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: false, // set to true in production with HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));
console.log('[BOOT] Session set');

// MongoDB connection
console.log('[BOOT] Connecting to Mongo at', process.env.MONGODB_URI || 'mongodb://localhost:27017/green-points');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/green-points', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes (core only)
app.use('/api', coreRoutes);
console.log('[BOOT] Core routes mounted');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Green Points Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

console.log('[BOOT] Starting server listen on', PORT);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
