// event-loop-demo.js - Run this using: node lessons/04-event-loop/event-loop-demo.js
// Or using npm script: npm run demo:event-loop

console.log("1. Start (Synchronous Call Stack)");

setTimeout(() => {
  console.log("2. setTimeout (Macrotask Queue - executed in Timers Phase)");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise (Microtask Queue - executed after current phase)");
});

process.nextTick(() => {
  console.log("4. nextTick (Executed immediately after call stack, before Microtask Queue)");
});

console.log("5. End (Synchronous Call Stack)");

// Expected Output order:
// 1. Start (Synchronous Call Stack)
// 5. End (Synchronous Call Stack)
// 4. nextTick (Executed immediately after call stack, before Microtask Queue)
// 3. Promise (Microtask Queue - executed after current phase)
// 2. setTimeout (Macrotask Queue - executed in Timers Phase)

// Explanation of Priority:
// 1. Synchronous Code runs first on the Main Execution Thread.
// 2. process.nextTick() callbacks are executed immediately after the current operation finishes, before the Event Loop microtask queue.
// 3. Microtask queue (Promises) is executed immediately after nextTick queue and before the event loop advances.
// 4. Timers (setTimeout, setInterval) are Macrotasks. They are checked and run on the next tick of the event loop during the Timers phase.
