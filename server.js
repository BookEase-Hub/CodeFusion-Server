const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const path = require('path');
const https = require('https');
const fs = require('fs');
const { securityHeaders, apiLimiter } = require('./middlewares/security');
const errorHandler = require('./middlewares/errorHandler');
const setupCollaboration = require('./services/collaborationService');

// Load env vars
dotenv.config({ path: './config.env' });

// --- TEMPORARY DIAGNOSTIC LOG ---
console.log('--- Checking Environment Variables ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('STRIPE_SECRET_KEY is set:', !!process.env.STRIPE_SECRET_KEY);
if (process.env.STRIPE_SECRET_KEY) {
    console.log('STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY.length);
    console.log('STRIPE_SECRET_KEY starts with "sk_":', process.env.STRIPE_SECRET_KEY.startsWith('sk_'));
}
console.log('------------------------------------');
// --- END TEMPORARY DIAGNOSTIC LOG ---

// Connect to database
// if (process.env.NODE_ENV !== 'test') {
//   connectDB();
// }

// Initialize express
const app = express();

// Security middleware
app.use(securityHeaders);
app.use(cors({
  origin: "https://code-fusion-ai-assistant-n9oa.vercel.app",
  credentials: true
}));
app.use(express.json());

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Mount routers
app.get('/', (req, res) => res.status(200).send('ok'));
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});
app.use('/api/v1', require('./routes/api'));
app.use('/', require('./routes/testDbRoutes'));
app.use('/', require('./routes/userRoutes'));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app;

// Setup WebSocket for collaboration
setupCollaboration(server);

const serverInstance = server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  serverInstance.close(() => process.exit(1));
});

module.exports = { app, serverInstance };
