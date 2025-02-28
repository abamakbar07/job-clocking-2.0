const axios = require('axios');
const { API_CONFIG } = require('../config/constants');
const logger = require('../utils/logger');

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      headers: API_CONFIG.HEADERS,
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

  async startJob(employeeData, activityId) {
    try {
      const payload = {
        site_id: "IDCBT",
        employer_id: "DSV",
        employee_id: employeeData.employee_id,
        activity_id: activityId,
        status: "Open",
        status_message: "Created by job clocking application",
        start_time: new Date().toLocaleString(),
        ClockingReference: "",
        DeviceName: API_CONFIG.DEVICE_IP
      };

      const response = await this.client.post('/JobClocking/AddJobClocking', payload);
      return response.data;
    } catch (error) {
      logger.error('Start Job Failed:', error);
      throw error;
    }
  }

  async stopJob(jobClockingId) {
    try {
      const payload = {
        job_clocking_id: jobClockingId,
        end_time: new Date().toLocaleString(),
        status: "Closed",
        status_message: "Closed by job clocking application"
      };

      const response = await this.client.post('/JobClocking/UpdateobClocking', payload);
      return response.data;
    } catch (error) {
      logger.error('Stop Job Failed:', error);
      throw error;
    }
  }
}

module.exports = new ApiService(); 