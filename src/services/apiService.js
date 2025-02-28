const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: 'http://rpt.apac.dsv.com:81/api',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
  }

  async get(endpoint) {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch (error) {
      logger.error('API Get Request Failed:', {
        endpoint,
        error: error.message
      });
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      logger.error('API Post Request Failed:', {
        endpoint,
        error: error.message
      });
      throw error;
    }
  }
}

module.exports = new ApiService(); 