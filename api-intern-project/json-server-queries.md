# JSON Server REST API Query Cheatsheet

This cheatsheet lists HTTP requests, query parameters, and testing commands that can be run against the mock database server (`http://localhost:3000`). 

JSON Server provides a fully-functional REST API out of the box. Use this cheatsheet to test queries in your browser, in the terminal using `curl`, or in API clients like Postman or Bruno.

---

## 🔑 1. Basic CRUD Operations

These endpoints correspond to standard Database Actions (Create, Read, Update, Delete).

| Action | HTTP Method | Endpoint | Description | Example Payload (JSON Body) |
|:---|:---|:---|:---|:---|
| **Get All** | `GET` | `/devices` | Retrieve the entire list of devices | *None* |
| **Get One** | `GET` | `/devices/:id` | Retrieve details of a single device | *None* |
| **Create** | `POST` | `/devices` | Add a new device to the registry | `{"name": "iPad Pro", "category": "Tablet", "serialNumber": "IPD-82"}` |
| **Replace** | `PUT` | `/devices/:id` | Completely overwrite an existing device | `{"name": "iPad Pro v2", "category": "Tablet", "serialNumber": "IPD-82-A"}` |
| **Update** | `PATCH` | `/devices/:id` | Partially modify fields of a device | `{"status": "Checked Out", "assignedTo": "Alice"}` |
| **Delete** | `DELETE` | `/devices/:id` | Permanently remove device | *None* |

---

## 🔍 2. Filtering & Search Parameters

JSON Server supports complex filtering, sorting, and pagination rules directly in the URL query parameters.

### Direct Matches
Query devices by matching exact field values:
- Fetch only devices that are currently available:
  `GET http://localhost:3000/devices?status=Available`
- Fetch laptops that are in maintenance:
  `GET http://localhost:3000/devices?category=Laptop&status=Maintenance`

### Full-Text Search
Search for a specific string across **all** fields of the records (e.g. searching "Jenkins" will search name, assignee, description, etc.):
- `GET http://localhost:3000/devices?q=Jenkins`

### Comparison Operators (Greater Than, Less Than, Exclude)
- **Exclude** a specific value (`_ne` for Not Equal):
  `GET http://localhost:3000/devices?status_ne=Maintenance`
- **Like** matches (e.g., case-insensitive contains):
  `GET http://localhost:3000/devices?name_like=MacBook`

---

## 📈 3. Sorting & Pagination

### Sorting
- Sort by `lastUpdated` field in ascending order:
  `GET http://localhost:3000/devices?_sort=lastUpdated`
- Sort by `lastUpdated` field in descending order (json-server v1 syntax):
  `GET http://localhost:3000/devices?_sort=-lastUpdated`
  *(Alternative older syntax: `GET http://localhost:3000/devices?_sort=lastUpdated&_order=desc`)*

### Pagination
Limit the number of results returned to prevent loading too many database entries:
- Get Page 1 containing 3 items:
  `GET http://localhost:3000/devices?_page=1&_per_page=3`
  *(Alternative older syntax: `GET http://localhost:3000/devices?_page=1&_limit=3`)*

---

## 💻 4. Command Line Examples (`curl`)

You can copy and run these command line directives in your terminal to practice querying the API manually!

### 📥 1. Fetch All Devices
```bash
curl -X GET http://localhost:3000/devices
```

### ➕ 2. Create (POST) a New Device
Note that we include the `Content-Type: application/json` header so the server understands our request body format.
```bash
curl -X POST http://localhost:3000/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Vision Pro",
    "category": "VR Headset",
    "status": "Available",
    "assignedTo": null,
    "serialNumber": "AVP-998822-XYZ",
    "description": "Spatial computer device assigned for testing WebXR browser compatibility.",
    "image": "/assets/vr.png",
    "lastUpdated": "2026-06-10T10:00:00Z"
  }'
```

### ✏️ 3. Update (PATCH) Assignment Status
Updates the assignee name and status without touching the other fields:
```bash
curl -X PATCH http://localhost:3000/devices/dev-01 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Checked Out",
    "assignedTo": "Sarah Jenkins"
  }'
```

### ❌ 4. Delete (DELETE) a Device
```bash
curl -X DELETE http://localhost:3000/devices/dev-06
```
