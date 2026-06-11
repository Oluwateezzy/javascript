// server-fixed.js - Run this using: node lessons/05-benchmarks/server-fixed.js
// Or using npm script: npm run demo:server-fixed

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Received request for: ${req.url} at ${new Date().toLocaleTimeString()}`);

  if (req.url === '/fast') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Fast response!\n');
  } 
  else if (req.url === '/slow') {
    // Simulate a slow operation asynchronously (like an async database call or async timer)
    // The event loop is NOT blocked. It can handle other requests in the meantime.
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Slow response after 5s (but server stayed responsive!)\n');
    }, 5000);
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Non-blocking server running at http://localhost:${PORT}/`);
  console.log(`Try this test:`);
  console.log(`1. Open browser tab: http://localhost:${PORT}/slow`);
  console.log(`2. Immediately open another tab: http://localhost:${PORT}/fast`);
  console.log(`Notice how the /fast request returns INSTANTLY, even though the /slow request is still running!`);
});
