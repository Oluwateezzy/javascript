// browser.js - Copy and run this inside your Browser Developer Console (F12 -> Console)

console.log("=== BROWSER JAVASCRIPT GLOBAL ENVIRONMENT ===");

// 1. DOM API Check
console.log("Type of document:", typeof document); // "object"
console.log("Type of window:", typeof window);     // "object"
console.log("Global 'this' refers to window:", this === window); // true

// 2. Node.js-specific Check
try {
  console.log(process);
} catch (e) {
  console.log("❌ process object is NOT defined (expected ReferenceError):", e.message);
}

try {
  const fs = require('fs');
} catch (e) {
  console.log("❌ require/CommonJS is NOT defined (expected ReferenceError):", e.message);
}

console.log("=============================================");
