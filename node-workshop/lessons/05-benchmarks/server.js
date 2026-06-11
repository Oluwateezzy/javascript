// server.js - Run this using: node lessons/05-benchmarks/server.js
// Or using npm script: npm run demo:server

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Received request for: ${req.url} at ${new Date().toLocaleTimeString()}`);

  if (req.url === '/fast') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Fast response!\n');
  } 
  else if (req.url === '/slow') {
    // Simulate a slow blocking operation (like CPU-intensive cryptography or synchronous loops)
    const start = Date.now();
    while (Date.now() - start < 5000) {
      // Blocking the event loop entirely for 5 seconds
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Slow response after 5s\n');
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`❌ Blocking server running at http://localhost:${PORT}/`);
  console.log(`Try this test:`);
  console.log(`1. Open browser tab: http://localhost:${PORT}/slow`);
  console.log(`2. Immediately open another tab: http://localhost:${PORT}/fast`);
  console.log(`Notice how the /fast request is blocked and waits for the /slow request to finish!`);
});
