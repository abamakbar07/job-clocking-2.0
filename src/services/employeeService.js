const apiService = require('./apiService');
const Table = require('cli-table3');

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
    const categories = await apiService.get('/GetCategories');
    const subCategories = await apiService.get('/GetSubCategories');
    return { categories, subCategories };
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
    console.clear();
    this.table.length = 0;
    this.table.push([
      employeeData.employeeId,
      employeeData.name,
      employeeData.currentActivity,
      employeeData.jobId,
      employeeData.status
    ]);
    console.log(this.table.toString());
  }
}

module.exports = new EmployeeService(); 