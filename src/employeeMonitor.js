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

    const scheduleTime = await askQuestion('Enter schedule time (HH:mm): ');
    const [hours, minutes] = scheduleTime.split(':');
    
    const scheduleDate = new Date();
    scheduleDate.setHours(parseInt(hours), parseInt(minutes), 0);

    const delay = scheduleDate.getTime() - Date.now();
    if (delay < 0) {
      scheduleDate.setDate(scheduleDate.getDate() + 1);
    }

    setTimeout(async () => {
      try {
        await employeeService.startJob(selectedJob.activity_id);
        console.log(`Scheduled job started at ${scheduleDate.toLocaleTimeString()}`);
      } catch (error) {
        logger.error('Error in scheduled job:', error);
      }
    }, delay);

    console.log(`Job scheduled for ${scheduleDate.toLocaleTimeString()}`);
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