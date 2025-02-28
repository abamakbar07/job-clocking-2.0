const apiService = require('./apiService');
const Table = require('cli-table3');
const logger = require('../utils/logger');
const { API_CONFIG } = require('../config/constants');
const { JOB_CATEGORIES, JOB_SUBCATEGORIES } = require('../config/jobCategories');

class EmployeeService {
  constructor() {
    this.userTable = new Table({
      head: ['Site ID', 'Employer ID', 'Employee ID', 'Device'],
      colWidths: [15, 15, 15, 25]
    });
    
    this.table = new Table({
      head: ['Employee ID', 'Name', 'Activity ID', 'Activity Name', 'Job ID', 'Clocking Ref', 'Status'],
      colWidths: [12, 20, 12, 25, 12, 15, 12]
    });
    
    this.currentEmployee = null;
    this.currentJobId = null;
    this.currentClockingRef = null;
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
      activityId: data.activity_id || 'N/A',
      activityName: data.activity_name || 'None',
      jobId: this.currentJobId || 'N/A',
      clockingRef: data.clockingReference || 'N/A',
      status: this.currentJobId ? 'Working' : 'Idle'
    };
  }

  displayUserData() {
    if (!this.currentEmployee) return 'No employee data available';

    return `
Employee Details:
• Site ID: ${this.currentEmployee.site_id}
• Employer ID: ${this.currentEmployee.employer_id}
• Employee ID: ${this.currentEmployee.employee_id}
• Name: ${this.currentEmployee.name}
• External Employee ID: ${this.currentEmployee.extern_employee_id}
• Department: ${this.currentEmployee.department_id || 'N/A'}
• Description: ${this.currentEmployee.description || 'N/A'}
• First Name: ${this.currentEmployee.first_name}
• Middle Name: ${this.currentEmployee.middle_name || 'N/A'}
• Last Name: ${this.currentEmployee.last_name}

Current Activity:
• Activity ID: ${this.currentEmployee.activity_id || 'N/A'}
• Activity Name: ${this.currentEmployee.activity_name || 'None'}
• Job Clocking ID: ${this.currentEmployee.job_clocking_id || 'N/A'}
• Clocking Reference: ${this.currentEmployee.clockingReference || 'N/A'}
• Status: ${this.currentEmployee.job_clocking_id ? 'Working' : 'Idle'}
• Manual Entry: ${this.currentEmployee.iS_MANUAL_ENTRY === '1' ? 'Yes' : 'No'}
• Device: ${API_CONFIG.DEVICE_IP}
`;
  }

  displayEmployeeStatus(employeeData) {
    const userDataDisplay = this.displayUserData();
    this.table.length = 0;
    this.table.push([
      employeeData.employeeId,
      employeeData.name,
      employeeData.activityId,
      employeeData.activityName,
      employeeData.jobId,
      employeeData.clockingRef,
      employeeData.status
    ]);
    return `${userDataDisplay}\n\n${this.table.toString()}`;
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