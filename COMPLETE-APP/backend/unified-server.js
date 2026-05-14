require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting School Van Management System - All 6 Modules');
console.log('=' .repeat(60));

const modules = [
  {
    name: 'Route & Schedule',
    path: '../../IT23224902-route-schedule/backend',
    port: 3001,
    color: '\x1b[32m' // Green
  },
  {
    name: 'Emergency & Safety',
    path: '../../IT24200911-emergency-safety/backend',
    port: 3002,
    color: '\x1b[31m' // Red
  },
  {
    name: 'Attendance',
    path: '../../IT24103801-attendance/backend',
    port: 3003,
    color: '\x1b[34m' // Blue
  },
  {
    name: 'Parent & Student',
    path: '../../IT24103642-parent-student/backend',
    port: 3004,
    color: '\x1b[35m' // Magenta
  },
  {
    name: 'Billing & Payment',
    path: '../../IT24104170-billing-payment/backend',
    port: 3005,
    color: '\x1b[33m' // Yellow
  },
  {
    name: 'Driver & Vehicle',
    path: '../../IT24102655-driver-vehicle/backend',
    port: 3006,
    color: '\x1b[36m' // Cyan
  }
];

const processes = [];

modules.forEach((module, index) => {
  const modulePath = path.join(__dirname, module.path);
  
  console.log(`${module.color}[${index + 1}/6] Starting ${module.name} on port ${module.port}...\x1b[0m`);
  
  // Use 'node.exe' explicitly for Windows
  const proc = spawn(process.execPath, ['server.js'], {
    cwd: modulePath,
    stdio: 'pipe',
    windowsHide: false
  });

  proc.stdout.on('data', (data) => {
    console.log(`${module.color}[${module.name}]\x1b[0m ${data.toString().trim()}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`${module.color}[${module.name} ERROR]\x1b[0m ${data.toString().trim()}`);
  });

  proc.on('error', (error) => {
    console.error(`${module.color}[${module.name} SPAWN ERROR]\x1b[0m ${error.message}`);
  });

  proc.on('close', (code) => {
    console.log(`${module.color}[${module.name}] Process exited with code ${code}\x1b[0m`);
  });

  processes.push({ name: module.name, process: proc });
});

console.log('\n' + '='.repeat(60));
console.log('✅ All 6 backend modules started!');
console.log('📡 API Endpoints:');
modules.forEach(m => {
  console.log(`   ${m.name}: http://172.20.10.3:${m.port}/api`);
});
console.log('\n💡 Press Ctrl+C to stop all servers');
console.log('='.repeat(60) + '\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all servers...');
  processes.forEach(({ name, process }) => {
    console.log(`   Stopping ${name}...`);
    process.kill();
  });
  process.exit(0);
});
