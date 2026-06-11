// blocking.js - Run this using: node lessons/05-benchmarks/blocking.js
// Or using npm script: npm run demo:blocking

function blockFor(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {
    // Blocks the execution thread and prevents the Event Loop from spinning
  }
}

console.time('total-time');
console.log("1. Starting blocking operation...");

// Schedule a timer that should fire in 1 second
setTimeout(() => {
  console.log("3. ⏰ setTimeout callback fired! (Expected delay: 1000ms)");
}, 1000);

// Run a blocking operation for 3 seconds
blockFor(3000); 
console.log("2. Blocking operation done (after 3 seconds)");

console.log("4. End of script");
console.timeEnd('total-time');

// OBSERVATION:
// The setTimeout was scheduled for 1000ms, but it is delayed by 3000ms!
// This is because the synchronous blockFor loop occupied the call stack completely,
// preventing the event loop from checking the Timers phase until the call stack cleared.
