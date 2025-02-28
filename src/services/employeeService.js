const apiService = require('./apiService');
const Table = require('cli-table3');
const logger = require('../utils/logger');
const { JOB_CATEGORIES, JOB_SUBCATEGORIES } = require('../config/jobCategories');

class EmployeeService {
  constructor() {
    this.table = new Table({
      head: ['Employee ID', 'Name', 'Current Activity', 'Job ID', 'Status'],
      colWidths: [15, 25, 25, 15, 15]
    });
    this.currentEmployee = null;
    this.currentJobId = null;
  }

  async getEmployeeStatus(userId, siteId = 'IDCBT') {
    const endpoint = `/GetEmployee/${userId}/${siteId}`;
    const data = await apiService.get(endpoint);
    this.currentEmployee = data;
    return this.formatEmployeeData(data);
  }

  async getAvailableJobs() {
    return {
      categories: JOB_CATEGORIES,
      subCategories: JOB_SUBCATEGORIES
    };
  }

  async startJob(activityId) {
    if (!this.currentEmployee) {
      throw new Error('No employee selected');
    }
    const response = await apiService.startJob(this.currentEmployee, activityId);
    this.currentJobId = response.job_clocking_id;
    return response;
  }

  async stopCurrentJob() {
    if (!this.currentJobId) {
      throw new Error('No active job to stop');
    }
    const response = await apiService.stopJob(this.currentJobId);
    this.currentJobId = null;
    return response;
  }

  formatEmployeeData(data) {
    return {
      employeeId: data.employee_id,
      name: data.display_name,
      currentActivity: data.activity_name || 'None',
      jobId: this.currentJobId || 'N/A',
      status: this.currentJobId ? 'Working' : 'Idle'
    };
  }

  displayEmployeeStatus(employeeData) {
    this.table.length = 0;
    this.table.push([
      employeeData.employeeId,
      employeeData.name,
      employeeData.currentActivity,
      employeeData.jobId,
      employeeData.status
    ]);
    return this.table.toString();
  }

  async scheduleJob(activityId, startTime, endTime) {
    if (!this.currentEmployee) {
      throw new Error('No employee selected');
    }

    const schedule = {
      activityId,
      startTime,
      endTime,
      isActive: true
    };

    // Start job at scheduled time
    const startDelay = startTime.getTime() - Date.now();
    if (startDelay > 0) {
      setTimeout(async () => {
        try {
          await this.startJob(activityId);
          logger.info(`Scheduled job started at ${startTime.toLocaleString()}`);
        } catch (error) {
          logger.error('Scheduled job start failed:', error);
        }
      }, startDelay);
    }

    // Stop job at scheduled time
    const endDelay = endTime.getTime() - Date.now();
    if (endDelay > 0) {
      setTimeout(async () => {
        try {
          await this.stopCurrentJob();
          logger.info(`Scheduled job stopped at ${endTime.toLocaleString()}`);
        } catch (error) {
          logger.error('Scheduled job stop failed:', error);
        }
      }, endDelay);
    }

    return schedule;
  }
}

module.exports = new EmployeeService(); 