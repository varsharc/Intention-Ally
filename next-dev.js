#!/usr/bin/env node

const { spawn } = require('child_process');
const nextDev = spawn('npx', ['next', 'dev', '-p', '5000', '-H', '0.0.0.0'], { stdio: 'inherit' });

nextDev.on('close', (code) => {
  process.exit(code);
});