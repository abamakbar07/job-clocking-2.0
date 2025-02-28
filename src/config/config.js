require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  apiUrl: process.env.API_URL,
  apiKey: process.env.API_KEY,
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config; 