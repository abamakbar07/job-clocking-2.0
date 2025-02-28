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
      const now = new Date();
      const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      const payload = {
        site_id: "IDCBT",
        employer_id: "DSV",
        employee_id: employeeData.employee_id,
        activity_id: parseInt(activityId),
        status: "Open",
        status_message: "Created by job clocking application",
        start_time: formattedDate,
        ClockingReference: "",
        DeviceName: API_CONFIG.DEVICE_IP
      };

      const response = await this.client.post('AddJobClocking', payload);
      return response.data;
    } catch (error) {
      logger.error('Start Job Failed:', error);
      throw error;
    }
  }

  async stopJob(jobClockingId) {
    try {
      const now = new Date();
      const formattedDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

      const payload = {
        end_time: formattedDate,
        job_clocking_id: jobClockingId
      };

      const response = await this.client.post('UpdateobClocking', payload);
      return response.data;
    } catch (error) {
      logger.error('Stop Job Failed:', error);
      throw error;
    }
  }
}

module.exports = new ApiService(); 