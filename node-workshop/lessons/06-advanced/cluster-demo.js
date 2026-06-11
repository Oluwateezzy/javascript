// cluster-demo.js - Run this using: node lessons/06-advanced/cluster-demo.js
// Or using npm script: npm run demo:cluster

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary || cluster.isMaster) {
  // Master process is responsible for spawning workers
  console.log(`=== CLUSTER PRIMARY PROCESS ===`);
  console.log(`Primary process PID: ${process.pid}`);
  console.log(`Detected CPU Cores: ${numCPUs}`);
  console.log(`Spawning ${numCPUs} worker processes to share the load...`);
  console.log(`-----------------------------------`);

  // Spawn workers equal to number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting worker...`);
    cluster.fork();
  });

} else {
  // Worker processes run the HTTP server
  http.createServer((req, res) => {
    console.log(`Request on worker process PID: ${process.pid}`);
    
    // Simulate a brief CPU task
    let count = 0;
    for (let i = 0; i < 1e7; i++) {
      count++;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Handled by worker process (PID: ${process.pid})\n`);
  }).listen(3000, () => {
    console.log(`Worker process started (PID: ${process.pid})`);
  });
}
