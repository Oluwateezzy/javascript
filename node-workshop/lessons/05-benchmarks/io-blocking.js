// io-blocking.js - Run this using: node lessons/05-benchmarks/io-blocking.js
// Or using npm script: npm run demo:io-blocking

const fs = require('fs');
const path = require('path');

const file1Path = path.join(__dirname, 'bigfile.txt');
const file2Path = path.join(__dirname, 'bigfile2.txt');

console.time('total-time');

console.log("1. Reading File 1 (Synchronous)...");
const file1 = fs.readFileSync(file1Path, 'utf8');
console.log(`2. File 1 read complete (${(file1.length / (1024 * 1024)).toFixed(2)} MB)`);

console.log("3. Reading File 2 (Synchronous)...");
const file2 = fs.readFileSync(file2Path, 'utf8');
console.log(`4. File 2 read complete (${(file2.length / (1024 * 1024)).toFixed(2)} MB)`);

console.log("5. Both files finished processing!");
console.timeEnd('total-time');

// OBSERVATION:
// The code runs line-by-line. File 2 reading cannot start until File 1 is fully read.
// The main JavaScript thread is completely blocked from doing anything else during this time.
