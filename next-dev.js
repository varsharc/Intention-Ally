#!/usr/bin/env node

const { spawn } = require('child_process');
const nextDev = spawn('npx', ['next', 'dev', '-p', '3000'], { stdio: 'inherit' });

nextDev.on('close', (code) => {
  process.exit(code);
});