// solution.js - Run using: node lessons/08-homework/solution.js
// Or using npm script: npm run demo:homework-solution

const fs = require('fs').promises;
const path = require('path');

// ✅ OPTIMIZED SOLUTION
// 1. Reads files in parallel using fs.promises and Promise.all
// 2. Implements try-catch to handle missing files gracefully without crashing
// 3. Batches heavy CPU processing and yields control back to event loop via setImmediate

async function processUserData(userIds) {
  // Step 1: Read all files in parallel. Handle errors on individual file level.
  const filePromises = userIds.map(async (id) => {
    const filePath = path.join(__dirname, 'users', `${id}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  });

  const files = await Promise.all(filePromises);

  // Filter out any errors (e.g. file not found)
  const validFiles = [];
  for (let i = 0; i < files.length; i++) {
    if (files[i].error) {
      console.warn(`⚠️ Warning: Failed to read user ${userIds[i]}: ${files[i].error.message}`);
    } else {
      validFiles.push(files[i].data);
    }
  }

  // Step 2: Process in batches to avoid blocking the event loop for a long duration.
  const results = [];
  const batchSize = 10; // Process 10 users per batch

  for (let i = 0; i < validFiles.length; i += batchSize) {
    const batch = validFiles.slice(i, i + batchSize);
    
    // Yield execution back to the event loop before processing each batch
    await new Promise((resolve) => setImmediate(resolve));
    
    batch.forEach((file) => {
      try {
        const user = JSON.parse(file);
        
        // Simulate heavy CPU-bound computation
        for (let j = 0; j < 10000000; j++) {
          Math.sqrt(j);
        }
        
        results.push(user);
      } catch (parseErr) {
        console.error(`❌ Failed to parse user JSON:`, parseErr.message);
      }
    });
  }

  return results;
}

// === Benchmark Execution ===
const userIds = Array.from({ length: 50 }, (_, i) => i + 1);

// We introduce one invalid ID to test error handling robustly
userIds.push(999); 

async function run() {
  console.time('Solution Homework Execution Time');
  console.log("Starting optimized non-blocking parallel process...");

  // Monitor event loop responsiveness
  let ticks = 0;
  const interval = setInterval(() => {
    ticks++;
  }, 10);

  const results = await processUserData(userIds);

  clearInterval(interval);
  console.log(`Successfully processed ${results.length} users.`);
  console.log(`Event loop ticks allowed during execution: ${ticks} (Expected: > 0, showing loop stayed responsive!)`);
  console.timeEnd('Solution Homework Execution Time');
}

run().catch(console.error);
