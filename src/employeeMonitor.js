const readline = require('readline');
const employeeService = require('./services/employeeService');
const logger = require('./utils/logger');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayScreen(statusTable, showMenu = true) {
  console.clear();
  console.log(statusTable);
  
  if (showMenu) {
    console.log('\nAvailable Commands:');
    console.log('1. Start Job');
    console.log('2. Stop Current Job');
    console.log('3. Schedule Job');
    console.log('4. Refresh Status');
    console.log('5. Exit');
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
      await refreshStatus(userId);
      break;
    case '5':
      console.log('Exiting...');
      process.exit(0);
    default:
      console.log('Invalid command');
  }
}

async function refreshStatus(userId) {
  try {
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);
  } catch (error) {
    logger.error('Error refreshing status:', error);
    console.log('Failed to refresh status:', error.message);
  }
}

async function startJobFlow(userId) {
  try {
    const { categories, subCategories } = await employeeService.getAvailableJobs();
    
    console.log('\nAvailable Job Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.job_clocking_name}`);
    });

    const catIndex = await askQuestion('Select category number: ');
    if (catIndex < 1 || catIndex > categories.length) {
      throw new Error('Invalid category number');
    }
    const selectedCategory = categories[catIndex - 1];

    const categoryJobs = subCategories.filter(sub => sub.group_id === selectedCategory.group_id);
    if (categoryJobs.length === 0) {
      throw new Error('No jobs available for this category');
    }

    console.log('\nAvailable Jobs:');
    categoryJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_clocking_name}`);
    });

    const jobIndex = await askQuestion('Select job number: ');
    if (jobIndex < 1 || jobIndex > categoryJobs.length) {
      throw new Error('Invalid job number');
    }
    const selectedJob = categoryJobs[jobIndex - 1];

    if (!selectedJob || !selectedJob.activity_id) {
      throw new Error('Invalid job selection');
    }

    await employeeService.startJob(selectedJob.activity_id);
    console.log('Job started successfully!');
    
    // Refresh display after job start
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);
  } catch (error) {
    logger.error('Error starting job:', error);
    console.log('Failed to start job:', error.message);
    
    // Refresh display after error
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);
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
    console.log('\nSchedule Options:');
    console.log('1. Schedule Start Job');
    console.log('2. Schedule Stop Current Job');
    
    const option = await askQuestion('Select option: ');
    
    if (option === '1') {
      await scheduleStartJob(userId);
    } else if (option === '2') {
      await scheduleStopJob(userId);
    } else {
      throw new Error('Invalid option');
    }
  } catch (error) {
    logger.error('Error in schedule flow:', error);
    console.log('Failed to schedule:', error.message);
  }
}

async function scheduleStartJob(userId) {
  try {
    const { categories, subCategories } = await employeeService.getAvailableJobs();
    
    console.log('\nAvailable Job Categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.job_clocking_name}`);
    });

    const catIndex = await askQuestion('Select category number: ');
    if (catIndex < 1 || catIndex > categories.length) {
      throw new Error('Invalid category number');
    }
    const selectedCategory = categories[catIndex - 1];

    const categoryJobs = subCategories.filter(sub => sub.group_id === selectedCategory.group_id);
    console.log('\nAvailable Jobs:');
    categoryJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.job_clocking_name}`);
    });

    const jobIndex = await askQuestion('Select job number: ');
    if (jobIndex < 1 || jobIndex > categoryJobs.length) {
      throw new Error('Invalid job number');
    }
    const selectedJob = categoryJobs[jobIndex - 1];

    console.log('\nEnter schedule details:');
    const startTimeStr = await askQuestion('Start time (HH:mm): ');
    const [startHours, startMinutes] = startTimeStr.split(':');

    const startTime = new Date();
    startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    if (startTime < Date.now()) {
      startTime.setDate(startTime.getDate() + 1);
    }

    await employeeService.scheduleJob(selectedJob.activity_id, startTime);
    console.log('\nJob scheduled successfully!');
    console.log(`Start: ${startTime.toLocaleString()}`);

    // Refresh display
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);
  } catch (error) {
    logger.error('Error scheduling job:', error);
    console.log('Failed to schedule job:', error.message);
  }
}

async function scheduleStopJob(userId) {
  console.log('\nEnter schedule details:');
  const stopTimeStr = await askQuestion('Stop time (HH:mm): ');
  const [stopHours, stopMinutes] = stopTimeStr.split(':');

  const stopTime = new Date();
  stopTime.setHours(parseInt(stopHours), parseInt(stopMinutes), 0);

  if (stopTime < Date.now()) {
    stopTime.setDate(stopTime.getDate() + 1);
  }

  await employeeService.scheduleStopJob(stopTime);
  console.log('\nStop job scheduled successfully!');
  console.log(`Stop Time: ${stopTime.toLocaleString()}`);

  // Refresh display
  const employeeData = await employeeService.getEmployeeStatus(userId);
  const statusTable = employeeService.displayEmployeeStatus(employeeData);
  displayScreen(statusTable);
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function startMonitoring(userId) {
  try {
    const employeeData = await employeeService.getEmployeeStatus(userId);
    const statusTable = employeeService.displayEmployeeStatus(employeeData);
    displayScreen(statusTable);

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