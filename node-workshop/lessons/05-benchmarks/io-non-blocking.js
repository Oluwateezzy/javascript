// io-non-blocking.js - Run this using: node lessons/05-benchmarks/io-non-blocking.js
// Or using npm script: npm run demo:io-non-blocking

const fs = require('fs').promises;
const path = require('path');

const file1Path = path.join(__dirname, 'bigfile.txt');
const file2Path = path.join(__dirname, 'bigfile2.txt');

async function readFiles() {
  console.time('total-time');
  console.log("1. Starting parallel asynchronous reads...");
  
  // Start both read operations concurrently.
  // libuv will dispatch these tasks to the operating system / thread pool.
  const [file1, file2] = await Promise.all([
    fs.readFile(file1Path, 'utf8'),
    fs.readFile(file2Path, 'utf8')
  ]);
  
  console.log(`2. File 1 complete (${(file1.length / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`3. File 2 complete (${(file2.length / (1024 * 1024)).toFixed(2)} MB)`);
  console.log("4. Both files finished processing!");
  console.timeEnd('total-time');
}

readFiles().catch(console.error);

// OBSERVATION:
// The files are read in parallel by libuv's file system worker threads.
// Because the operations are asynchronous, the event loop remains unblocked,
// and both files are processed concurrently, reducing the total time significantly!
