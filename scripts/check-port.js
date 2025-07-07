#!/usr/bin/env node

const net = require('net');

const port = process.argv[2] || 8081;

const server = net.createServer();

server.listen(port, () => {
  console.log(`✅ Port ${port} is available`);
  server.close();
  process.exit(0);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use. Please stop the existing server or choose a different port.`);
    process.exit(1);
  } else {
    console.error(`❌ Error checking port ${port}:`, err.message);
    process.exit(1);
  }
});
