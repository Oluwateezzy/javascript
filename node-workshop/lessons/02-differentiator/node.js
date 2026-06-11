// node.js - Run this using: node lessons/02-differentiator/node.js
// Or using npm script: npm run demo:diff-node

console.log("=== NODE.JS JAVASCRIPT GLOBAL ENVIRONMENT ===");

// 1. Browser-specific Check
console.log("Type of window:", typeof window);       // "undefined"
console.log("Type of document:", typeof document);     // "undefined"

// 2. Node.js Globals Check
console.log("Type of process:", typeof process);       // "object"
console.log("Node version:", process.version);
console.log("Current working directory (process.cwd()):", process.cwd());
console.log("Process ID (PID):", process.pid);
console.log("Global 'this' in Node.js module context:", this === global); // false (inside modules it's module.exports)
console.log("Type of global object (global):", typeof global); // "object"

// 3. Module System Check
const fs = require('fs');
console.log("Type of 'fs' module:", typeof fs);       // "object"

console.log("=============================================");
