// broken.js - Run using: node lessons/08-homework/broken.js
// Or using npm script: npm run demo:homework-broken

const fs = require('fs');
const path = require('path');

// ❌ BROKEN VERSION
// 1. It blocks the event loop (heavy synchronous computation in loop)
// 2. Files aren't read in parallel (readFileSync in loop)
// 3. Error handling is missing (if a file is missing, the whole app crashes)

function processUserData(userIds) {
  const results = [];
  
  for (let id of userIds) {
    const filePath = path.join(__dirname, 'users', `${id}.json`);
    const file = fs.readFileSync(filePath, 'utf8');
    const user = JSON.parse(file);
    
    // Simulate heavy computation
    for (let i = 0; i < 10000000; i++) {
      Math.sqrt(i);
    }
    
    results.push(user);
  }
  
  return results;
}

// === Benchmark Execution ===
const userIds = Array.from({ length: 50 }, (_, i) => i + 1);

console.time('Broken Homework Execution Time');
console.log("Starting broken sequential blocking process...");

// Monitor event loop blocking
let ticks = 0;
const interval = setInterval(() => {
  ticks++;
}, 10);

const results = processUserData(userIds);

clearInterval(interval);
console.log(`Successfully processed ${results.length} users.`);
console.log(`Event loop ticks allowed during execution: ${ticks} (Expected: ~0 due to blocking!)`);
console.timeEnd('Broken Homework Execution Time');
