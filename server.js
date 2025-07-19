const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const https = require('https');
const fs = require('fs');
const { securityHeaders, apiLimiter } = require('./middlewares/security');
const errorHandler = require('./middlewares/errorHandler');
const setupCollaboration = require('./services/collaborationService');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const config = require('./config');

// Connect to database
connectDB();

// Initialize express
const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors());
app.use(express.json());

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Mount routers
app.use('/api/v1', require('./routes/api'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use(errorHandler);

const PORT = config.port;

// Create HTTPS server if in production
let server;
if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
  const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  server = https.createServer(credentials, app);
} else {
  server = app;
}

// Setup WebSocket for collaboration
setupCollaboration(server);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const logger = require('./config/logger');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
