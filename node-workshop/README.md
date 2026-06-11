# 🚀 Node.js Intern Workshop: The Event Loop & Async Programming

Welcome to the hands-on Node.js workshop! This repository is designed to help you master Node.js fundamentals, understand how the JavaScript engine (V8) interacts with libuv, and learn how to write high-performance asynchronous non-blocking code.

---

## 🛠️ Getting Started

First, navigate into the workshop directory:
```bash
cd node-workshop
```

### Setup Database & Files
Before running the benchmarks, prepare the mock files and user database:
```bash
npm run setup:io
npm run setup:homework
```

---

## 📚 Workshop Structure

### 1. What is Node.js?
**The Elevator Pitch:**
> *"Node.js is JavaScript running outside the browser, powered by Chrome's V8 engine and libuv. It lets JavaScript talk to your file system, network, and operating system—things a browser can't do for security reasons."*

**Key Differentiator:**
- **Browser JavaScript**: Can't access local files, restricted network policies (CORS), accesses DOM APIs.
- **Node.js JavaScript**: Full file system access, full raw socket/network capabilities, OS information, and capability to spawn child processes.

---

### 2. What Differentiates Node from Browser JavaScript?

Compare these two environments by executing/copying the following code files:

- **Browser JS Demo**: [lessons/02-differentiator/browser.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/02-differentiator/browser.js) (Copy-paste this into your Chrome console).
- **Node JS Demo**: [lessons/02-differentiator/node.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/02-differentiator/node.js)
  ```bash
  npm run demo:diff-node
  ```

#### Comparative Table

| Feature | Browser JS | Node.js |
| :--- | :---: | :---: |
| **DOM APIs** (`document`, etc.) | ✅ | ❌ |
| **Global Window Object** (`window`) | ✅ | ❌ |
| **File System Access** (`fs`) | ❌ | ✅ |
| **Native HTTP Server** (`http`) | ❌ | ✅ |
| **Child Processes** (`child_process`) | ❌ | ✅ |
| **Process Control** (`process` object) | ❌ | ✅ |
| **Module Systems** | ES Modules (newer) | CommonJS (`require`) & ES Modules |
| **Global Context** | `window` / `self` | `global` / `globalThis` |

---

### 3. How Does It Work?

Node.js coordinates V8 and libuv to achieve asynchronous executions:

```
┌─────────────────────────────────────────────────────────┐
│                    JavaScript Code                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    V8 Engine                             │
│         (Compiles JS → Machine Code)                     │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                      libuv                               │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   Event Loop    │  │   Thread Pool (4 threads)   │   │
│  │                 │  │  - File I/O                  │   │
│  │  Timers         │  │  - DNS lookups               │   │
│  │  I/O Callbacks  │  │  - Crypto (pbkdf2, random)  │   │
│  │  Microtasks     │  │  - Zlib compression          │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

> **Key Insight**: Node isn't strictly single-threaded! Your JavaScript logic runs on a single main thread, but **libuv utilizes an internal worker thread pool** for blocking/complex OS tasks (like cryptography, compression, and file I/O).

---

### 4. What is the Event Loop?

The event loop continuously checks and processes deferred execution callbacks. Run this live visualization to see execution priorities:

- **Demo Script**: [lessons/04-event-loop/event-loop-demo.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/04-event-loop/event-loop-demo.js)
  ```bash
  npm run demo:event-loop
  ```

#### Order Priority:
`process.nextTick` ➔ `Promise.then` (Microtasks) ➔ `setTimeout` / `setInterval` (Macrotasks)

---

### 5. Benchmark Examples: The "Aha!" Moment

Run these live comparisons to see performance differences:

#### ⚡ Benchmark 1: Timers & Blocking vs Non-Blocking
- **Blocking Timers**: [lessons/05-benchmarks/blocking.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/blocking.js) (`npm run demo:blocking`)
- **Non-blocking Timers**: [lessons/05-benchmarks/non-blocking.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/non-blocking.js) (`npm run demo:non-blocking`)

#### 💾 Benchmark 2: Sequential Sync I/O vs Concurrent Async I/O
- **Sync I/O**: [lessons/05-benchmarks/io-blocking.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/io-blocking.js) (`npm run demo:io-blocking`)
- **Async I/O**: [lessons/05-benchmarks/io-non-blocking.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/io-non-blocking.js) (`npm run demo:io-non-blocking`)

#### 🌐 Benchmark 3: Blocking HTTP Server vs Non-Blocking Server
- **Blocking Server**: [lessons/05-benchmarks/server.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/server.js) (`npm run demo:server`)
- **Responsive Server**: [lessons/05-benchmarks/server-fixed.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/05-benchmarks/server-fixed.js) (`npm run demo:server-fixed`)
  *Test instructions*: Open browser and load `localhost:3000/slow`. Immediately in another tab or curl, load `localhost:3000/fast` and see the difference!

---

### 6. Advanced Mechanics

#### 🧵 A. The Thread Pool Concurrency Demo
See how the size of the libuv thread pool (default 4) impacts concurrency:
- **Demo Script**: [lessons/06-advanced/thread-pool.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/06-advanced/thread-pool.js)
- Run with default pool size (4 threads, 5th and 6th operations queue up):
  ```bash
  npm run demo:threadpool
  ```
- Run with 8 threads (all 6 operations execute in parallel):
  ```bash
  npm run demo:threadpool-large
  ```

#### 🕸️ B. Cluster Module (Multi-process Scaling)
Utilize the cluster module to fork workers matching the CPU core count, permitting true parallel processing of HTTP traffic on the same port:
- **Cluster Demo**: [lessons/06-advanced/cluster-demo.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/06-advanced/cluster-demo.js)
  ```bash
  npm run demo:cluster
  ```

#### 🚫 C. Common Anti-Patterns
- **Anti-pattern 1 (JSON in loops)**: [lessons/06-advanced/antipattern-json.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/06-advanced/antipattern-json.js) (`npm run demo:antipattern-json`)
- **Anti-pattern 2 (Sync fs in servers)**: [lessons/06-advanced/antipattern-fs.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/06-advanced/antipattern-fs.js) (`npm run demo:antipattern-fs`)

---

### 7. Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────┐
│                    NODE.JS CHEAT SHEET                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  EVENT LOOP PRIORITY:                                       │
│  1. process.nextTick()    ← Highest                         │
│  2. Promise.then()        ← Microtasks                      │
│  3. Timer callbacks       ← setTimeout/setInterval          │
│  4. I/O callbacks         ← File/Network                    │
│  5. setImmediate()        ← Check phase                     │
│  6. Close handlers        ← Lowest                          │
│                                                             │
│  WHEN TO USE WHAT:                                          │
│  • process.nextTick()  → Defer but execute ASAP             │
│  • Promise.then()      → Async flow control                 │
│  • setImmediate()      → Defer I/O operations              │
│  • setTimeout(fn,0)    → Defer to next timer phase         │
│  • queueMicrotask()    → Use in browser, not Node          │
│                                                             │
│  THREAD POOL (libuv):                                       │
│  • Default: 4 threads                                       │
│  • Set: UV_THREADPOOL_SIZE=8 node app.js                    │
│  • Used for: fs.*, crypto.pbkdf2, zlib, DNS lookups         │
│                                                             │
│  MEMORY LEAK WATCH:                                         │
│  • Global variables accumulate                              │
│  • Closures keeping references                              │
│  • Forgotten timers/setInterval                             │
│  • Large buffers not freed                                  │
└─────────────────────────────────────────────────────────────┘
```

---

### 8. Homework Exercise

**Your Task:** Fix the broken code inside:
- [lessons/08-homework/broken.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/08-homework/broken.js)

Verify the event loop blocks completely during computation. Then rewrite it using async/await, parallel reads (`Promise.all`), proper error catching (to prevent crashes on missing profiles), and yield control back to the event loop using `setImmediate`.

Compare your implementation with the reference solution:
- [lessons/08-homework/solution.js](file:///Users/oluwatobiloba/Desktop/javascript/node-workshop/lessons/08-homework/solution.js)

Run both to inspect the latency differences and the ticks allowance count:
```bash
npm run demo:homework-broken
npm run demo:homework-solution
```
