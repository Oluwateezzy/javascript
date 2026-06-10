/**
 * details.js
 * 
 * Controller for the Single Device Specification page (item-details.html).
 * Extracts URL parameters, requests device specs, manages check-ins/check-outs,
 * controls maintenance statuses, and manages registry deletion.
 */

import { getDeviceById, updateDevice, deleteDevice } from './api.js';

// --- State ---
let deviceId = null;
let currentDevice = null;

// --- DOM Elements ---
const elements = {
  themeToggleBtn: document.getElementById('theme-toggle'),
  loadingIndicator: document.getElementById('details-loading'),
  errorContainer: document.getElementById('details-error'),
  errorMessageText: document.getElementById('error-message-text'),
  specSheet: document.getElementById('device-spec-sheet'),
  toastContainer: document.getElementById('toast-container'),
  
  // Data displays
  detailImage: document.getElementById('detail-image'),
  detailCategoryBadge: document.getElementById('detail-category-badge'),
  detailName: document.getElementById('detail-name'),
  detailSerial: document.getElementById('detail-serial'),
  detailUpdated: document.getElementById('detail-updated'),
  detailStatusBadge: document.getElementById('detail-status-badge'),
  detailDescription: document.getElementById('detail-description'),
  specType: document.getElementById('spec-type'),
  specSerial: document.getElementById('spec-serial'),
  specId: document.getElementById('spec-id'),
  
  // Forms & Control Boxes
  checkoutForm: document.getElementById('checkout-form'),
  assigneeNameInput: document.getElementById('assignee-name'),
  checkinForm: document.getElementById('checkin-form'),
  assignedUserName: document.getElementById('assigned-user-name'),
  maintenanceInfoBox: document.getElementById('maintenance-info-box'),
  
  // Status Overrides Buttons
  btnSetMaintenance: document.getElementById('btn-set-maintenance'),
  btnReleaseMaintenance: document.getElementById('btn-release-maintenance'),
  
  // Deletion Elements
  btnDeleteDevice: document.getElementById('btn-delete-device'),
  deleteModal: document.getElementById('delete-modal'),
  closeDeleteModal: document.getElementById('close-delete-modal'),
  cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
  confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
  deleteItemName: document.getElementById('delete-item-name')
};

// --- Toast System ---
function showToast(title, message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse forwards';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// --- Theme Management ---
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

// --- Load Spec Sheet ---
async function loadDeviceSpecs() {
  // Hide spec sheet and show loading spinner
  elements.specSheet.classList.add('hidden');
  elements.errorContainer.classList.add('hidden');
  elements.loadingIndicator.classList.remove('hidden');
  
  try {
    currentDevice = await getDeviceById(deviceId);
    renderDeviceSpecs(currentDevice);
    elements.loadingIndicator.classList.add('hidden');
    elements.specSheet.classList.remove('hidden');
  } catch (error) {
    elements.loadingIndicator.classList.add('hidden');
    elements.errorContainer.classList.remove('hidden');
    elements.errorMessageText.textContent = `Server response error: ${error.message}`;
    showToast('Failed to load specs', error.message, 'error');
  }
}

/**
 * Maps device database object into the HTML spec sheet displays.
 * @param {Object} device 
 */
function renderDeviceSpecs(device) {
  // Hero values
  elements.detailImage.src = device.image;
  elements.detailImage.onerror = () => { elements.detailImage.src = '/assets/laptop.png'; };
  elements.detailCategoryBadge.textContent = device.category;
  elements.detailName.textContent = device.name;
  elements.detailSerial.textContent = device.serialNumber;
  elements.detailUpdated.textContent = formatRelativeTime(device.lastUpdated);
  
  // Description & table
  elements.detailDescription.textContent = device.description || 'No description available.';
  elements.specType.textContent = device.category;
  elements.specSerial.textContent = device.serialNumber;
  elements.specId.textContent = device.id;
  
  // Status Badges
  const badgeClass = device.status.toLowerCase().replace(' ', '');
  elements.detailStatusBadge.className = `badge badge-${badgeClass}`;
  elements.detailStatusBadge.textContent = device.status;
  
  // Control Panel layouts based on Status
  elements.checkoutForm.classList.add('hidden');
  elements.checkinForm.classList.add('hidden');
  elements.maintenanceInfoBox.classList.add('hidden');
  
  elements.btnSetMaintenance.classList.add('hidden');
  elements.btnReleaseMaintenance.classList.add('hidden');
  
  if (device.status === 'Available') {
    elements.checkoutForm.classList.remove('hidden');
    elements.btnSetMaintenance.classList.remove('hidden');
  } else if (device.status === 'Checked Out') {
    elements.checkinForm.classList.remove('hidden');
    elements.assignedUserName.textContent = device.assignedTo;
    elements.btnSetMaintenance.classList.remove('hidden');
  } else if (device.status === 'Maintenance') {
    elements.maintenanceInfoBox.classList.remove('hidden');
    elements.btnReleaseMaintenance.classList.remove('hidden');
  }
}

// --- Booking Operations Event Listeners ---
function initBookingActions() {
  // Checkout (Assign) device
  elements.checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const assignee = elements.assigneeNameInput.value.trim();
    if (!assignee) {
      elements.assigneeNameInput.closest('.form-group').classList.add('invalid');
      return;
    }
    
    elements.assigneeNameInput.closest('.form-group').classList.remove('invalid');
    
    // Toggle loading states
    const btn = elements.checkoutForm.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    text.classList.add('hidden');
    spinner.classList.remove('hidden');
    
    try {
      await updateDevice(deviceId, {
        status: 'Checked Out',
        assignedTo: assignee
      });
      showToast('Checkout Success', `Device assigned to ${assignee}.`, 'success');
      elements.assigneeNameInput.value = '';
      await loadDeviceSpecs();
    } catch (err) {
      showToast('Checkout Failed', err.message, 'error');
    } finally {
      btn.disabled = false;
      text.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  });

  // Checkin (Return) device
  elements.checkinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = elements.checkinForm.querySelector('button[type="submit"]');
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    
    btn.disabled = true;
    text.classList.add('hidden');
    spinner.classList.remove('hidden');
    
    try {
      await updateDevice(deviceId, {
        status: 'Available',
        assignedTo: null
      });
      showToast('Return Processed', 'Device is now available in the registry.', 'success');
      await loadDeviceSpecs();
    } catch (err) {
      showToast('Return Failed', err.message, 'error');
    } finally {
      btn.disabled = false;
      text.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  });
}

// --- Maintenance Status overrides ---
function initMaintenanceOverrides() {
  // Put device offline
  elements.btnSetMaintenance.addEventListener('click', async () => {
    elements.btnSetMaintenance.disabled = true;
    try {
      await updateDevice(deviceId, {
        status: 'Maintenance',
        assignedTo: null // Clear checkout assignment if entering repairs
      });
      showToast('Status Override', 'Device put offline into maintenance.', 'info');
      await loadDeviceSpecs();
    } catch (err) {
      showToast('Status Change Failed', err.message, 'error');
    } finally {
      elements.btnSetMaintenance.disabled = false;
    }
  });

  // Put device back online
  elements.btnReleaseMaintenance.addEventListener('click', async () => {
    elements.btnReleaseMaintenance.disabled = true;
    try {
      await updateDevice(deviceId, {
        status: 'Available',
        assignedTo: null
      });
      showToast('Status Override', 'Device released back to operations service.', 'success');
      await loadDeviceSpecs();
    } catch (err) {
      showToast('Status Change Failed', err.message, 'error');
    } finally {
      elements.btnReleaseMaintenance.disabled = false;
    }
  });
}

// --- Delete De-registration Modal handlers ---
function initDeleteRegistryActions() {
  const toggleModal = (show) => {
    if (show) {
      elements.deleteItemName.textContent = currentDevice ? currentDevice.name : 'this device';
      elements.deleteModal.classList.remove('hidden');
      elements.deleteModal.setAttribute('aria-hidden', 'false');
    } else {
      elements.deleteModal.classList.add('hidden');
      elements.deleteModal.setAttribute('aria-hidden', 'true');
    }
  };

  elements.btnDeleteDevice.addEventListener('click', () => toggleModal(true));
  elements.closeDeleteModal.addEventListener('click', () => toggleModal(false));
  elements.cancelDeleteBtn.addEventListener('click', () => toggleModal(false));
  elements.deleteModal.addEventListener('click', (e) => {
    if (e.target === elements.deleteModal) toggleModal(false);
  });

  elements.confirmDeleteBtn.addEventListener('click', async () => {
    const text = elements.confirmDeleteBtn.querySelector('.btn-text');
    const spinner = elements.confirmDeleteBtn.querySelector('.btn-spinner');
    
    elements.confirmDeleteBtn.disabled = true;
    text.classList.add('hidden');
    spinner.classList.remove('hidden');
    
    try {
      await deleteDevice(deviceId);
      showToast('De-registered', 'Device removed from registry. Redirecting...', 'success');
      
      setTimeout(() => {
        window.location.href = './index.html';
      }, 1500);
    } catch (err) {
      showToast('Delete Failed', err.message, 'error');
      elements.confirmDeleteBtn.disabled = false;
      text.classList.remove('hidden');
      spinner.classList.add('hidden');
      toggleModal(false);
    }
  });
}

// --- Helpers ---
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

// --- Init Loader ---
document.addEventListener('DOMContentLoaded', () => {
  // Extract device id from URL search parameters (e.g. ?id=dev-01)
  const urlParams = new URLSearchParams(window.location.search);
  deviceId = urlParams.get('id');
  
  initTheme();
  
  if (!deviceId) {
    elements.loadingIndicator.classList.add('hidden');
    elements.errorContainer.classList.remove('hidden');
    elements.errorMessageText.textContent = 'Query Parameter ID is missing in URL path.';
    return;
  }
  
  // Set up action form submissions and modal confirmations
  initBookingActions();
  initMaintenanceOverrides();
  initDeleteRegistryActions();
  
  // Call API
  loadDeviceSpecs();
});
