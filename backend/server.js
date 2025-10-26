const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// --- CORS (Cross-Origin Resource Sharing) Configuration ---
// This is a security feature that controls which websites can access your API.

// A list of websites that are allowed to connect.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3003', // Your current frontend development URL
  'http://127.0.0.1:3003',
  'http://localhost:3004',
  'http://127.0.0.1:3004',
  'http://localhost:3005',
  'http://127.0.0.1:3005',
  'http://localhost:3007',
  'http://127.0.0.1:3007'
];

// For production, we add the live frontend URL from an environment variable.
if (process.env.NODE_ENV === 'production' && process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
  console.log(`CORS: Allowing production origin: ${process.env.FRONTEND_URL}`);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, or server-to-server requests)
    if (!origin) return callback(null, true);
    
    // If the incoming request's origin is in our whitelist, allow it.
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      // Otherwise, block it with a CORS error.
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allows the frontend to send cookies and authorization headers.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable CORS with the options above.
app.use(cors(corsOptions));
// Handle pre-flight requests (the browser sends an OPTIONS request first for complex calls).
app.options('*', cors(corsOptions));


// --- Middleware ---

// A simple logger to show incoming requests in the console.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Body-parser middleware to understand JSON and URL-encoded data from requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Database Connection ---
// Connect to the MongoDB database using the URI from the .env file.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/raitha_mithra')
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// --- API Routes ---
// This is where the application's logic lives.
app.use('/api/auth', require('./routes/auth'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));

// A simple "health check" route to verify that the API is running.
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RAITHA MITHRA API is running' });
});


// --- Error Handling ---

// A central middleware to catch and handle errors.
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  // Specifically handle CORS errors.
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({ message: 'CORS Error: This origin is not allowed to access the API.' });
  }
  // For all other errors, send a generic 500 server error.
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// A 404 handler for any requests to routes that don't exist.
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// --- Server Startup ---
const DEFAULT_PORT = 5001;
const port = parseInt(process.env.PORT, 10) || DEFAULT_PORT;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`   RAITHA MITHRA API available at: http://localhost:${port}`);
});
