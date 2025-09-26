const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/errorHandler');
const globalErrorHandler = require('./controllers/errorController');

// Routers
const apiRouter = require('./routes/api'); // Main router
const { handleWebhook } = require('./controllers/billingController'); // Import webhook handler directly

const app = express();

// 1) GLOBAL MIDDLEWARES
// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Stripe webhook endpoint - must be before express.json()
app.post('/api/v1/billing/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({ whitelist: [] }));

// Compression middleware
app.use(compression());

// 2) ROUTES
// I will simplify the routing structure to use the single main apiRouter
app.use('/api/v1', apiRouter);

// Integrate the new backend routes
const v2Router = require('./dist/router');
app.use('/api/v2', v2Router);


// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 3) GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;