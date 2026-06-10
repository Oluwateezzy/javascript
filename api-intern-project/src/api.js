/**
 * api.js
 * 
 * This module encapsulates all REST API communications with the local JSON Server.
 * It uses async/await, the Fetch API, and Promise rejection handling to teach interns
 * modern, production-grade network request handling in JavaScript.
 */

// Base URL for the JSON Server mock API
const API_BASE_URL = 'http://localhost:3000/devices';

/**
 * Helper to handle fetch responses and throw meaningful errors.
 * This teaches interns how HTTP status codes (4xx, 5xx) behave in the Fetch API,
 * since fetch() does NOT reject on HTTP error statuses (like 404 or 500).
 * 
 * @param {Response} response - Fetch Response object
 * @returns {Promise<any>} Parsed JSON payload
 */
async function handleResponse(response) {
  if (!response.ok) {
    // Attempt to extract error details from response body
    let errorDetails = '';
    try {
      const data = await response.json();
      errorDetails = data.message || JSON.stringify(data);
    } catch {
      errorDetails = `HTTP status ${response.status} (${response.statusText})`;
    }
    throw new Error(`API Error: ${errorDetails}`);
  }
  
  // JSON Server returns empty body for DELETE (200/204), handle it gracefully
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return null;
  }
  
  return await response.json();
}

/**
 * GET: Fetch all devices from the API with optional query filters.
 * 
 * @param {Object} filters - Search parameters
 * @param {string} [filters.category] - Filter by device type
 * @param {string} [filters.status] - Filter by check-out status
 * @returns {Promise<Array>} Array of device objects
 */
export async function getDevices(filters = {}) {
  try {
    const url = new URL(API_BASE_URL);
    
    // Append JSON Server supported filters
    if (filters.category) {
      url.searchParams.append('category', filters.category);
    }
    if (filters.status) {
      url.searchParams.append('status', filters.status);
    }
    
    // Sort by lastUpdated desc by default so new additions go to top
    // Note: json-server v1 supports sorting with _sort=-lastUpdated or _sort=lastUpdated&_order=desc
    // We will apply sorting dynamically here.
    url.searchParams.append('_sort', '-lastUpdated');

    const response = await fetch(url.toString());
    return await handleResponse(response);
  } catch (error) {
    console.error('getDevices failed:', error);
    throw error; // Re-throw so controller can display toast alert
  }
}

/**
 * GET: Fetch a single device by its ID.
 * 
 * @param {string} id - The device identifier
 * @returns {Promise<Object>} The device object
 */
export async function getDeviceById(id) {
  if (!id) throw new Error('Device ID is required to fetch details.');
  
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error(`getDeviceById for id ${id} failed:`, error);
    throw error;
  }
}

/**
 * POST: Register a new device in the system registry.
 * 
 * @param {Object} deviceData - The new device details
 * @returns {Promise<Object>} The created device object (returned by server with ID)
 */
export async function createDevice(deviceData) {
  try {
    const payload = {
      ...deviceData,
      status: 'Available', // Default status for new devices
      assignedTo: null,
      lastUpdated: new Date().toISOString()
    };
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('createDevice failed:', error);
    throw error;
  }
}

/**
 * PATCH: Partially update a device. Ideal for checkout assignments or status overrides.
 * 
 * @param {string} id - The device ID
 * @param {Object} updates - Key-value pairs of fields to update
 * @returns {Promise<Object>} The updated device object
 */
export async function updateDevice(id, updates) {
  if (!id) throw new Error('Device ID is required for updates.');
  
  try {
    const payload = {
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`updateDevice for id ${id} failed:`, error);
    throw error;
  }
}

/**
 * DELETE: Permanently remove a device from the database.
 * 
 * @param {string} id - The device ID to remove
 * @returns {Promise<null>} Resolves with null upon successful deletion
 */
export async function deleteDevice(id) {
  if (!id) throw new Error('Device ID is required for deletion.');
  
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error(`deleteDevice for id ${id} failed:`, error);
    throw error;
  }
}
