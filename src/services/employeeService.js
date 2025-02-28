const apiService = require('./apiService');
const Table = require('cli-table3');

class EmployeeService {
  constructor() {
    this.table = new Table({
      head: ['Employee ID', 'Name', 'Department', 'Activity', 'Clocking Status'],
      colWidths: [15, 30, 15, 20, 20]
    });
  }

  async getEmployeeStatus(userId, siteId = 'IDCBT') {
    const endpoint = `/JobClocking/GetEmployee/${userId}/${siteId}`;
    const data = await apiService.get(endpoint);
    return this.formatEmployeeData(data);
  }

  formatEmployeeData(data) {
    return {
      employeeId: data.employee_id,
      name: data.display_name,
      department: data.department_id || 'N/A',
      activity: data.activity_name || 'N/A',
      clockingStatus: data.clockingReference || 'Not Clocked'
    };
  }

  displayEmployeeStatus(employeeData) {
    console.clear(); // Clear the terminal
    this.table.length = 0; // Clear existing table data
    this.table.push([
      employeeData.employeeId,
      employeeData.name,
      employeeData.department,
      employeeData.activity,
      employeeData.clockingStatus
    ]);
    console.log(this.table.toString());
  }
}

module.exports = new EmployeeService(); 