const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const diseaseRoutes = require('./routes/diseaseRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const profitRoutes = require('./routes/profitRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AgriSense REST API',
    version: '1.0.0',
    tagline: 'Smart Detection. Better Decisions. Healthier Crops.',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch 404 and Forward to Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 AGRISENSE BACKEND API SERVER RUNNING ON PORT ${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Tagline: "Smart Detection. Better Decisions. Healthier Crops."`);
  console.log(`====================================================`);
});

module.exports = { app, server };
