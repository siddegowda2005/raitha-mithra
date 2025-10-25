const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3003',
  'http://127.0.0.1:3003',
  'http://localhost:3004',
  'http://127.0.0.1:3004',
  'http://localhost:3005',
  'http://127.0.0.1:3005',
  'http://localhost:3007',   // frontend in your screenshot
  'http://127.0.0.1:3007'
];

// Allow overriding from env (optional)
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS and preflight handling
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raitha_mithra', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RAITHA MITHRA API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err && err.stack ? err.stack : err);
  // If CORS error from corsOptions
  if (err && err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS Error: Access denied' });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Port setup
const DEFAULT_PORT = 5001;
let port = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

const startServer = (p) => {
  const server = app.listen(p)
    .on('listening', () => {
      console.log(`Server running on port ${p}`);
      console.log(`RAITHA MITHRA API: http://localhost:${p}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        const nextPort = p + 1 > 65535 ? DEFAULT_PORT : p + 1;
        console.log(`Port ${p} is busy, trying port ${nextPort}...`);
        startServer(nextPort);
      } else {
        console.error('Server error:', err);
      }
    });
};

startServer(port);