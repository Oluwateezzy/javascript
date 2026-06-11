// thread-pool.js - Run this using: node lessons/06-advanced/thread-pool.js
// Or with default thread pool size: npm run demo:threadpool
// Or with larger thread pool size: npm run demo:threadpool-large

const crypto = require('crypto');

// Log the current configured size of the libuv threadpool (defaults to 4 if not set)
const threadPoolSize = process.env.UV_THREADPOOL_SIZE || 4;
console.log(`=== LIBUV THREAD POOL DEMO ===`);
console.log(`Current UV_THREADPOOL_SIZE: ${threadPoolSize}`);
console.log(`-----------------------------------`);

const start = Date.now();

function runHash(id) {
  // pbkdf2 is a CPU-bound cryptographic function that Node delegates to the libuv threadpool.
  crypto.pbkdf2('password', 'salt', 100000, 512, 'sha512', (err, derivedKey) => {
    if (err) throw err;
    const duration = Date.now() - start;
    console.log(`Task ${id} completed in ${duration}ms`);
  });
}

// We fire 6 hashing operations.
// By default, since the thread pool has 4 threads:
// - Tasks 1-4 will run concurrently on the 4 threads and finish around the same time (~1-1.5s).
// - Tasks 5 and 6 will wait until threads become free, completing later (~2-3s).
// Run this with npm run demo:threadpool-large (which sets UV_THREADPOOL_SIZE=8) to see all 6 run in parallel!
for (let i = 1; i <= 6; i++) {
  runHash(i);
}
