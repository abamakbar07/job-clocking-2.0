const readline = require('readline');
const employeeService = require('./services/employeeService');
const logger = require('./utils/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayScreen(statusTable, showMenu = true) {
  console.clear();
  console.log('Employee Status:');
  console.log(statusTable);
  
  if (showMenu) {
    console.log('\nAvailable Commands:');
    console.log('1. Start Job');
    console.log('2. Stop Current Job');
    console.log('3. Schedule Job');
    console.log('4. Exit');
    console.log('\nEnter command number:');
  }
}

async function handleUserInput(input, userId) {
  switch (input) {
    case '1':
      await startJobFlow(userId);
      break;
    case '2':
      await stopJobFlow();
      break;
    case '3':
      await scheduleJobFlow(userId);
      break;
    case '4':
      console.log('Exiting...');
      process.exit(0);
    default:
      console.log('Invalid command');
  }
  
  // Get latest status and redisplay
  const employeeData = await employeeService.getEmployeeStatus(userId);
  const statusTable = employeeService.displayEmployeeStatus(employeeData);
  displayScreen(statusTable);
}

async function startJobFlow(userId) {
  try {
    const { categories, subCategories } = await employeeService.getAvailableJobs();
    
    console.log('\nAvailable Job Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.job_clocking_name}`);
    });

    const catIndex = await askQuestion('Select category number: ');
    const selectedCategory = categories[catIndex - 1];

    const categoryJobs = subCategories.filter(sub => sub.group_id === selectedCategory.group_id);
    console.log('\nAvailable Jobs:');
    categoryJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_clocking_name}`);
    });

    const jobIndex = await askQuestion('Select job number: ');
    const selectedJob = categoryJobs[jobIndex - 1];

    await employeeService.startJob(selectedJob.activity_id);
    console.log('Job started successfully!');
  } catch (error) {
    logger.error('Error starting job:', error);
    console.log('Failed to start job:', error.message);
  }
}

async function stopJobFlow() {
  try {
    await employeeService.stopCurrentJob();
    console.log('Job stopped successfully!');
  } catch (error) {
    logger.error('Error stopping job:', error);
    console.log('Failed to stop job:', error.message);
  }
}

async function scheduleJobFlow(userId) {
  try {
    const { categories, subCategories } = await employeeService.getAvailableJobs();
    
    console.log('\nAvailable Job Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.job_clocking_name}`);
    });

    const catIndex = await askQuestion('Select category number: ');
    const selectedCategory = categories[catIndex - 1];

    const categoryJobs = subCategories.filter(sub => sub.group_id === selectedCategory.group_id);
    console.log('\nAvailable Jobs:');
    categoryJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_clocking_name}`);
    });

    const jobIndex = await askQuestion('Select job number: ');
    const selectedJob = categoryJobs[jobIndex - 1];

    console.log('\nEnter schedule details:');
    const startTimeStr = await askQuestion('Start time (HH:mm): ');
    const endTimeStr = await askQuestion('End time (HH:mm): ');

    const [startHours, startMinutes] = startTimeStr.split(':');
    const [endHours, endMinutes] = endTimeStr.split(':');

    const startTime = new Date();
    startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endTime = new Date();
    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    // Adjust dates if times are for next day
    if (startTime < Date.now()) {
      startTime.setDate(startTime.getDate() + 1);
    }
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    await employeeService.scheduleJob(selectedJob.activity_id, startTime, endTime);
    console.log('\nJob scheduled successfully!');
    console.log(`Start: ${startTime.toLocaleString()}`);
    console.log(`End: ${endTime.toLocaleString()}`);

    // Get latest status and redisplay
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);
  } catch (error) {
    logger.error('Error scheduling job:', error);
    console.log('Failed to schedule job:', error.message);
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function startMonitoring(userId) {
  try {
    // Initial fetch and display
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);

    // Set up periodic refresh
    setInterval(async () => {
      try {
        const updatedData = await employeeService.getEmployeeStatus(userId);
        const updatedTable = employeeService.displayEmployeeStatus(updatedData);
        displayScreen(updatedTable);
      } catch (error) {
        logger.error('Error updating employee status:', error);
      }
    }, 5000);

    rl.on('line', (input) => handleUserInput(input, userId));
  } catch (error) {
    logger.error('Error starting employee monitoring:', error);
    process.exit(1);
  }
}

console.log('Welcome to Job Clock Monitor');
rl.question('Enter employee ID to monitor: ', (userId) => {
  console.log(`Starting monitoring for employee ID: ${userId}`);
  startMonitoring(userId);
}); 