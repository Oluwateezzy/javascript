// antipattern-json.js - Run this using: node lessons/06-advanced/antipattern-json.js
// Or using npm script: npm run demo:antipattern-json

console.log("=== ANTI-PATTERN 1: BLOCKING EVENT LOOP WITH HEAVY JSON PARSING ===");

// Create a huge mock JSON array to simulate massive API data payload
const size = 100000;
const hugeArray = Array(size).fill('{"id":1234,"name":"John Doe","role":"intern","score":9.5,"details":{"skills":["js","node"],"active":true}}');

// Test 1: Blocking execution
function runBlockingTest() {
  console.log("\n--- Starting Blocking JSON Parse ---");
  const start = Date.now();
  
  // Set a timer to check if it's delayed
  let timerFired = false;
  setTimeout(() => {
    timerFired = true;
    console.log(`⏰ Timer fired inside blocking test! Delay: ${Date.now() - start}ms (Expected ~0ms)`);
  }, 0);

  // Synchronous loop that blocks the event loop
  hugeArray.forEach(item => JSON.parse(item));
  
  console.log(`❌ Blocking JSON parse finished in ${Date.now() - start}ms`);
}

// Test 2: Non-Blocking execution via batched setImmediate
function runNonBlockingTest() {
  console.log("\n--- Starting Non-Blocking (Batched) JSON Parse ---");
  const start = Date.now();
  
  // Set a timer to check if it's delayed
  let timerFired = false;
  const timer = setInterval(() => {
    console.log(`⏰ Event loop is ALIVE! Interstitial timer checked in at ${Date.now() - start}ms`);
  }, 10);

  function processBatch(arr, startIdx = 0, batchSize = 1000) {
    if (startIdx >= arr.length) {
      clearInterval(timer);
      console.log(`✅ Non-blocking JSON parse finished in ${Date.now() - start}ms`);
      return;
    }
    
    // Process a small chunk synchronously
    for (let i = startIdx; i < startIdx + batchSize && i < arr.length; i++) {
      JSON.parse(arr[i]);
    }
    
    // Yield execution to the event loop check phase, letting other tasks (like timers/I/O) execute
    setImmediate(() => processBatch(arr, startIdx + batchSize, batchSize));
  }

  processBatch(hugeArray, 0, 2000);
}

// Run the blocking test first, then run the non-blocking test after a small delay
runBlockingTest();

setTimeout(() => {
  runNonBlockingTest();
}, 2000);
