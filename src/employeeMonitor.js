const readline = require('readline');
const employeeService = require('./services/employeeService');
const logger = require('./utils/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function startMonitoring(userId) {
  try {
    // Initial fetch
    const employeeData = await employeeService.getEmployeeStatus(userId);
    employeeService.displayEmployeeStatus(employeeData);

    // Set up periodic refresh
    setInterval(async () => {
      try {
        const updatedData = await employeeService.getEmployeeStatus(userId);
        employeeService.displayEmployeeStatus(updatedData);
      } catch (error) {
        logger.error('Error updating employee status:', error);
      }
    }, 5000); // Refresh every 5 seconds
  } catch (error) {
    logger.error('Error starting employee monitoring:', error);
    process.exit(1);
  }
}

// Prompt for user ID
rl.question('Enter employee ID to monitor: ', (userId) => {
  console.log(`Starting monitoring for employee ID: ${userId}`);
  startMonitoring(userId);
  rl.close();
}); 