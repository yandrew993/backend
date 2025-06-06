import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoute.js';
import resultRoutes from './routes/resultRoute.js';
import announcementRoutes from './routes/announcementRoute.js';
import studentRoutes from "./routes/studentRoute.js";
import paymentRoute from './routes/paymentRoute.js';
import callbackRoutes from './routes/callbackRoute.js'
import waitingRoute from './routes/waitingRoute.js';
import feeRoute from './routes/feeRoute.js';
import totalRoute from './routes/totalRouter.js';
import subjectRoutes from './routes/subjectRoute.js';
import bookRoutes from './routes/bookRoute.js';
import classRoutes from './routes/classRoute.js';
const app = express();

// Enhanced CORS Configuration
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://a54f-102-215-33-50.ngrok-free.app',
  // Add any other domains you need to allow
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Headers',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Length', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Special handling for preflight requests
app.options('*', cors(corsOptions));

// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

  // Set to true if you need the website to include cookies in the requests
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', resultRoutes);
app.use('/api', announcementRoutes);
app.use('/api', studentRoutes);
app.use('/api', subjectRoutes);
app.use('/api', bookRoutes); 
app.use('/api', classRoutes);
app.use('/api/payment', paymentRoute);
app.use('/api/callback', callbackRoutes);// Ensure callback has its own route
app.use('/api/complete', waitingRoute)
app.use('/api', feeRoute)
app.use('/api', totalRoute)

// M-Pesa Callback URL Verification Endpoint
app.get('/api/callback/verify', (req, res) => {
  res.status(200).send('Callback URL verified');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the School Management API');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});