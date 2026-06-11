// antipattern-fs.js - Run this using: node lessons/06-advanced/antipattern-fs.js
// Or using npm script: npm run demo:antipattern-fs

const http = require('http');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const configPath = path.join(__dirname, 'mock-config.json');

// Write a mock config file
fs.writeFileSync(configPath, JSON.stringify({ serverName: "Node Workshop", version: "1.0", timeout: 3000, debug: true }, null, 2));

const server = http.createServer(async (req, res) => {
  console.log(`[Server] Request received for ${req.url}`);

  if (req.url === '/config-bad') {
    // ❌ ANTI-PATTERN: Reading file synchronously inside request handler.
    // Every time a user hits this page, the entire server process halts and cannot process any other request
    // until the file system completes the read operation.
    try {
      const config = fs.readFileSync(configPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(config);
    } catch (err) {
      res.writeHead(500);
      res.end('Error reading config');
    }
  } 
  
  else if (req.url === '/config-good') {
    // ✅ BEST PRACTICE: Reading file asynchronously using promises.
    // While the disk controller reads the file, the CPU/main thread can handle other connections.
    try {
      const config = await fsPromises.readFile(configPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(config);
    } catch (err) {
      res.writeHead(500);
      res.end('Error reading config');
    }
  } 
  
  else {
    res.writeHead(404);
    res.end('Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`=== ANTI-PATTERN 2: SYNCHRONOUS FILE SYSTEM READS ===`);
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`- Hit http://localhost:${PORT}/config-bad to trigger the blocking operation.`);
  console.log(`- Hit http://localhost:${PORT}/config-good to trigger the non-blocking operation.`);
});
