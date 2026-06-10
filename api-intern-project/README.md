# Tech Inventory Operations Dashboard (TechOps)

Welcome to the **Tech Inventory Operations Dashboard**! This is an interactive educational sandbox project designed specifically for software engineering interns to master core modern web development concepts. 

By running and extending this codebase, you will gain hands-on experience with:
1. **Asynchronous JavaScript** (`Promises`, `async/await`, error handling).
2. **REST API Integrations** (CRUD operations using the standard `Fetch API`).
3. **ES Modules (ESM)** (Structuring vanilla JavaScript files cleanly into modular service & control layers).
4. **Responsive Layouts** (Mobile-first CSS design, CSS Custom Variables, and CSS Grid).

---

## 🏗️ Project Architecture

This project is structured with a strict separation of concerns, representing how modern production-grade frontend apps are designed:

```
api-intern-project/
├── index.html            # Main dashboard UI
├── item-details.html     # Single device specifications & operations sheet
├── styles.css            # Custom CSS variables, responsive design, component layouts
├── db.json               # Local mockup database for json-server
├── package.json          # Node project config (Vite, json-server, dependencies)
└── src/
    ├── api.js            # API Wrapper Module (fetches database entries using async/await)
    ├── app.js            # Controller Module for index.html (orchestrates state, filters, theme)
    └── details.js        # Controller Module for item-details.html (URL parsing, form events)
```

---

## ⚡ Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

### Setup and Running
1. Open your terminal, navigate to the `api-intern-project` directory.
2. Install the necessary development dependencies:
   ```bash
   npm install
   ```
3. Boot up the local development servers:
   ```bash
   npm start
   ```
   *Note: This script uses the `concurrently` package to start two servers at the same time:*
   * **JSON Server (REST API)**: Running at [http://localhost:3000](http://localhost:3000)
   * **Vite (Frontend Dev Server)**: Running at [http://localhost:5173](http://localhost:5173) (Open this link in your browser!)

---

## 🎓 Core Concepts Explained

### 1. Asynchronous JavaScript & REST API Integration
In web development, network requests are *asynchronous*. This means they take time to complete, and we don't want to freeze the browser while waiting for a response.

#### Promises & Async/Await
A **Promise** represents a value that will be available in the future. Modern JS uses the `async/await` syntax to write clean, synchronous-looking asynchronous code.
Compare this in [src/api.js](file:///Users/oluwatobiloba/Desktop/javascript/api-intern-project/src/api.js):
```javascript
// Using Async/Await
export async function getDeviceById(id) {
  const response = await fetch(`http://localhost:3000/devices/${id}`);
  return await response.json();
}
```

#### The Fetch API Gotcha
A crucial lesson: **`fetch()` only rejects (throws an error) if a network error occurs** (like if you're offline or the server is completely down). If the server returns an error status (like `404 Not Found` or `500 Internal Server Error`), `fetch()` still succeeds!
To handle this, we check the `response.ok` property:
```javascript
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}
```

---

### 2. ES Modules (ESM)
Instead of putting all our JavaScript into a single, massive file, we split it into modules. 
- In [src/api.js](file:///Users/oluwatobiloba/Desktop/javascript/api-intern-project/src/api.js), we **export** helper functions:
  ```javascript
  export async function getDevices() { ... }
  ```
- In [src/app.js](file:///Users/oluwatobiloba/Desktop/javascript/api-intern-project/src/app.js), we **import** them:
  ```javascript
  import { getDevices } from './api.js';
  ```
To use ES Modules directly in the browser, we add `type="module"` to the script tag in our HTML:
```html
<script type="module" src="./src/app.js"></script>
```
We also specify `"type": "module"` in `package.json` so Node knows to compile ES imports.

---

### 3. Responsive CSS Grid & Mobile-First Layouts
Responsive design ensures a webpage looks great on small phones, tablets, and large desktop screens.

#### The Magic of `auto-fit` and `minmax`
In [styles.css](file:///Users/oluwatobiloba/Desktop/javascript/api-intern-project/styles.css), the device grid uses this key layout rule:
```css
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```
* **`minmax(280px, 1fr)`**: Tells columns they cannot be smaller than `280px`, but can expand to fill any remaining space.
* **`auto-fit`**: Tells the browser to automatically compute how many columns can fit into the row. If the screen is `320px` wide, it shows 1 column. If it's `1200px` wide, it fits 4 columns—**all without writing media queries!**

#### Mobile-First Media Queries
Mobile-first means you write the styles for small screens *first*, and then use media queries with `min-width` to override layouts for larger screens. 
```css
/* Mobile styles are default (single column) */
.spec-details-grid {
  display: grid;
  grid-template-columns: 1fr;
}

/* Override for larger Tablet screens */
@media (min-width: 768px) {
  .spec-details-grid {
    grid-template-columns: 1.6fr 1fr; /* Split layout */
  }
}
```

---

## 🛠️ Intern Learning Challenges

Ready to practice? Extend this project by completing these three development challenges:

### 🔍 Challenge 1: "Last Synced" Timer (Async & DOM)
**Goal:** Show users when the dashboard inventory list was last fetched.
* **Requirements:**
  1. Add a small text container in `index.html` (e.g. `<span id="sync-time"></span>`).
  2. In `src/app.js`, when a load successfully completes, update this element to show the current time (e.g. `Last updated: 10:15:32 AM`).
  3. *Bonus:* Use `setInterval` to show a ticking counter showing how many seconds ago the list synced (e.g. "Synced 12 seconds ago").

### 📐 Challenge 2: Grid vs. List Toggle (CSS & Layouts)
**Goal:** Let users toggle between Card Grid view and List Rows view.
* **Requirements:**
  1. Add a toggle button next to the filters in `index.html`.
  2. In `src/app.js`, listen to clicks on this button and toggle a `.list-view` class on `#devices-grid`.
  3. In `styles.css`, write CSS overrides. For example, when `.devices-grid` has the `.list-view` class, change `grid-template-columns` to `1fr` and layout the card internals horizontally (using flexbox or nested grid columns).

### 📝 Challenge 3: Operation logs (REST API & DB Schema)
**Goal:** Track checkout histories for each device.
* **Requirements:**
  1. In `db.json`, add an `activityLog` array to each device record:
     ```json
     "activityLog": [
       {"timestamp": "2026-06-10T09:00:00Z", "action": "Checked Out", "user": "Marcus Vance"}
     ]
     ```
  2. In `src/details.js`, update the check-in and check-out logic. When a user submits the form, append a new log entry to `activityLog` array and send the updated array to the server via the `updateDevice` PATCH request.
  3. Render this activity log at the bottom of the device spec sheet page in a neat vertical timeline layout.
