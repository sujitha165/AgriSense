require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'agrisense-super-secret-key-harvest-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DB: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrisense_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  UPLOAD_DIR: path.join(__dirname, '..', 'uploads'),
  AI_API_URL: process.env.AI_API_URL || 'http://127.0.0.1:8000',
  AI_API_KEY: process.env.AI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
  AI_CHAT_BASE_URL: process.env.AI_CHAT_BASE_URL || 'https://api.openai.com/v1',
  AI_CHAT_TIMEOUT_MS: parseInt(process.env.AI_CHAT_TIMEOUT_MS || '30000', 10)
};
