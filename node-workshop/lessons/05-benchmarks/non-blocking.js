// non-blocking.js - Run this using: node lessons/05-benchmarks/non-blocking.js
// Or using npm script: npm run demo:non-blocking

console.time('total-time');
console.log("1. Starting non-blocking operation...");

// Schedule a timer to execute after 3 seconds
setTimeout(() => {
  console.log("4. ✅ Timer done after 3 seconds");
  console.timeEnd('total-time');
}, 3000);

console.log("2. This runs immediately (does not wait for the 3s timer)");
console.log("3. Server is free to handle other requests while waiting!");

// OBSERVATION:
// The setTimeout delegates the timer to the host environment (libuv/OS),
// freeing up the main JavaScript thread to execute the rest of the script immediately.
