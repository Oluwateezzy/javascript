/**
 * app.js
 * 
 * Main controller for the Tech Inventory Dashboard (index.html).
 * Handles user interactions, local state, search debouncing, client-side filtering,
 * theme selection, form submissions, and triggers requests to api.js.
 */

import { getDevices, createDevice } from './api.js';

// --- State Management ---
let state = {
  devices: [],           // Array representing the active inventory list from the server
  filters: {
    search: '',          // Text filter value
    category: '',        // Category select filter value
    status: ''           // Status select filter value
  }
};

// --- DOM Elements Reference ---
const elements = {
  themeToggleBtn: document.getElementById('theme-toggle'),
  addDeviceBtn: document.getElementById('add-device-btn'),
  addDrawer: document.getElementById('add-drawer'),
  closeDrawerBtn: document.getElementById('close-drawer-btn'),
  cancelDrawerBtn: document.getElementById('cancel-drawer-btn'),
  addDeviceForm: document.getElementById('add-device-form'),
  
  searchInput: document.getElementById('search-input'),
  categoryFilter: document.getElementById('category-filter'),
  statusFilter: document.getElementById('status-filter'),
  
  devicesGrid: document.getElementById('devices-grid'),
  loadingIndicator: document.getElementById('loading-indicator'),
  noResults: document.getElementById('no-results'),
  toastContainer: document.getElementById('toast-container'),
  
  // Stats
  statTotal: document.getElementById('stat-total'),
  statAvailable: document.getElementById('stat-available'),
  statCheckedOut: document.getElementById('stat-checkedout'),
  statMaintenance: document.getElementById('stat-maintenance')
};

// --- Toast Notification System ---
/**
 * Triggers a premium glassmorphic toast notification.
 * @param {string} title - Title of notification
 * @param {string} message - Description message
 * @param {'success' | 'error' | 'info'} type - Type dictates icon and border colors
 */
export function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' 
    ? 'fa-circle-check' 
    : type === 'error' 
    ? 'fa-circle-xmark' 
    : 'fa-circle-info';
    
  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;
  
  elements.toastContainer.appendChild(toast);
  
  // Slide out and remove toast after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// --- Theme Management ---
/**
 * Syncs the HTML theme attribute and matches the local storage state.
 */
function initTheme() {
  const storedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  document.documentElement.setAttribute('data-theme', storedTheme);
  
  elements.themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast('Theme Changed', `Switched to ${newTheme} mode.`, 'info');
  });
}

// --- Loading Indicators ---
/**
 * Toggles loader overlay.
 * @param {boolean} show 
 */
function toggleLoading(show) {
  if (show) {
    elements.loadingIndicator.classList.remove('hidden');
  } else {
    elements.loadingIndicator.classList.add('hidden');
  }
}

// --- Drawer (Add Device Panel) Toggles ---
/**
 * Opens and closes the modal drawer.
 */
function initDrawer() {
  const openDrawer = () => {
    elements.addDrawer.setAttribute('aria-hidden', 'false');
    // Accessibility: shift focus to first form input
    document.getElementById('device-name').focus();
  };
  
  const closeDrawer = () => {
    elements.addDrawer.setAttribute('aria-hidden', 'true');
    resetFormErrors();
    elements.addDeviceForm.reset();
  };
  
  elements.addDeviceBtn.addEventListener('click', openDrawer);
  elements.closeDrawerBtn.addEventListener('click', closeDrawer);
  elements.cancelDrawerBtn.addEventListener('click', closeDrawer);
  
  // Close drawer if clicking outside the container (on overlay backdrop)
  elements.addDrawer.addEventListener('click', (e) => {
    if (e.target === elements.addDrawer) {
      closeDrawer();
    }
  });
}

// --- Form Validation & Submission ---
/**
 * Resets visual error validation states.
 */
function resetFormErrors() {
  const groups = elements.addDeviceForm.querySelectorAll('.form-group');
  groups.forEach(g => g.classList.remove('invalid'));
}

/**
 * Validates inputs and returns details if all checks pass.
 */
function validateForm() {
  resetFormErrors();
  let isValid = true;
  const formData = new FormData(elements.addDeviceForm);
  const data = {};
  
  // Required fields array
  const required = ['name', 'category', 'serialNumber'];
  
  for (let [key, value] of formData.entries()) {
    const trimmed = value.trim();
    data[key] = trimmed;
    
    // Check validation
    if (required.includes(key) && !trimmed) {
      const inputEl = document.getElementsByName(key)[0] || document.getElementById(`device-${key}`);
      if (inputEl) {
        inputEl.closest('.form-group').classList.add('invalid');
      }
      isValid = false;
    }
  }
  
  // Custom check for image: default placeholder if empty
  if (!data.image) {
    // Standard placeholder based on category
    const cat = data.category.toLowerCase().replace(' ', '');
    data.image = `/assets/${cat}.png`;
  }
  
  return isValid ? data : null;
}

/**
 * Hook submission event for registration form.
 */
function initFormSubmit() {
  elements.addDeviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const validatedData = validateForm();
    if (!validatedData) return; // Exit if invalid, styling already applied
    
    // Show spinner inside button
    const submitBtn = elements.addDeviceForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    
    try {
      // API call using await
      await createDevice(validatedData);
      
      // Close drawer & reset
      elements.addDrawer.setAttribute('aria-hidden', 'true');
      elements.addDeviceForm.reset();
      
      showToast('Registration Success', `"${validatedData.name}" added to database.`, 'success');
      
      // Refresh inventory
      await loadAndRenderInventory();
    } catch (err) {
      showToast('Registration Failed', err.message, 'error');
    } finally {
      // Reset button states
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  });
}

// --- Data Fetching & Rendering ---
/**
 * Fetches latest inventory status and refreshes layouts.
 */
async function loadAndRenderInventory() {
  toggleLoading(true);
  try {
    // Retrieve list from API, forwarding category & status selection
    const fetchedDevices = await getDevices({
      category: state.filters.category,
      status: state.filters.status
    });
    
    state.devices = fetchedDevices;
    
    // Apply search filter client-side (great practice for array filtering!)
    applyClientFilteringAndRender();
    
    // Re-calculate statistics based on full list (before search filters for dashboard accuracy)
    updateDashboardStats(state.devices);
  } catch (error) {
    console.log(error);
    showToast('Connection Refused', 'Could not sync database. Ensure json-server is running.', 'error');
    elements.devicesGrid.innerHTML = '';
    elements.noResults.classList.remove('hidden');
    elements.noResults.querySelector('h3').textContent = 'Database offline';
  } finally {
    toggleLoading(false);
  }
}

/**
 * Filter list client-side based on search queries and render cards.
 */
function applyClientFilteringAndRender() {
  const query = state.filters.search.toLowerCase().trim();
  
  // Filter devices based on case-insensitive matches (name, serial, assigned assignee)
  const filtered = state.devices.filter(device => {
    const nameMatch = device.name.toLowerCase().includes(query);
    const serialMatch = device.serialNumber.toLowerCase().includes(query);
    const assigneeMatch = device.assignedTo && device.assignedTo.toLowerCase().includes(query);
    
    return nameMatch || serialMatch || assigneeMatch;
  });
  
  renderCards(filtered);
}

/**
 * Dynamically computes statistics cards value count.
 * @param {Array} list 
 */
function updateDashboardStats(list) {
  const total = list.length;
  const available = list.filter(d => d.status === 'Available').length;
  const checkedOut = list.filter(d => d.status === 'Checked Out').length;
  const maintenance = list.filter(d => d.status === 'Maintenance').length;
  
  elements.statTotal.textContent = total;
  elements.statAvailable.textContent = available;
  elements.statCheckedOut.textContent = checkedOut;
  elements.statMaintenance.textContent = maintenance;
}

/**
 * Creates HTML elements and appends cards to DOM.
 * @param {Array} list 
 */
function renderCards(list) {
  elements.devicesGrid.innerHTML = '';
  
  if (list.length === 0) {
    elements.noResults.classList.remove('hidden');
    return;
  }
  
  elements.noResults.classList.add('hidden');
  
  list.forEach(device => {
    // Generate card element
    const card = document.createElement('a');
    card.href = `./item-details.html?id=${device.id}`;
    card.className = 'device-card';
    
    // Determine status badge class
    const statusClass = device.status.toLowerCase().replace(' ', '');
    
    // Populate card layout
    card.innerHTML = `
      <div class="card-image-box">
        <img src="${device.image}" alt="${device.name}" onerror="this.src='/assets/laptop.png'">
        <span class="card-category-tag">${device.category}</span>
      </div>
      <div class="card-body">
        <div class="card-header-row">
          <div>
            <h3 class="card-title">${device.name}</h3>
            <span class="card-serial">SN: ${device.serialNumber}</span>
          </div>
          <span class="badge badge-${statusClass}">${device.status}</span>
        </div>
        <p class="card-description">${device.description || 'No description provided.'}</p>
        <div class="card-footer-row">
          <div class="assignee-info">
            <i class="fa-solid ${device.status === 'Checked Out' ? 'fa-user' : 'fa-circle-dot'}"></i>
            <span>${device.status === 'Checked Out' ? device.assignedTo : 'Registry'}</span>
          </div>
          <span><i class="fa-regular fa-clock"></i> ${formatRelativeTime(device.lastUpdated)}</span>
        </div>
      </div>
    `;
    
    elements.devicesGrid.appendChild(card);
  });
}

/**
 * Relative date formatter helper.
 * @param {string} dateString 
 */
function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  const past = new Date(dateString);
  const now = new Date();
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// --- Search & Filters Event Listeners (with Debounce) ---
/**
 * Debounce utility helper to delay executing function calls.
 * Essential for modern web optimization to prevent slamming API endpoints on keypresses.
 * @param {Function} func - Function to execute
 * @param {number} delay - delay in milliseconds
 */
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

function initFilters() {
  // Search input debounced to 300ms
  const handleSearchInput = debounce((e) => {
    state.filters.search = e.target.value;
    applyClientFilteringAndRender();
  }, 300);
  
  elements.searchInput.addEventListener('input', handleSearchInput);
  
  // Category selector triggers refetch
  elements.categoryFilter.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    loadAndRenderInventory();
  });
  
  // Status selector triggers refetch
  elements.statusFilter.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    loadAndRenderInventory();
  });
}

// --- Initialization Block ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDrawer();
  initFormSubmit();
  initFilters();
  
  // Initial API call
  loadAndRenderInventory();
});
