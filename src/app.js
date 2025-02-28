const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const apiService = require('./services/apiService');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Example route using the API service
app.get('/api/data', async (req, res, next) => {
  try {
    const data = await apiService.get('/some-endpoint');
    res.json(data);
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

module.exports = app; 