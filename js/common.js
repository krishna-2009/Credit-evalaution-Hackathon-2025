document.addEventListener('DOMContentLoaded', function() {
  initSidebar();
  initNotifications();
  initTooltips();
  updateLastUpdated();
});

/**
 * Initialize sidebar functionality
 */
function initSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  if (sidebarToggle && sidebar) {
    // Toggle sidebar on menu button click
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      if (mainContent) {
        mainContent.classList.toggle('expanded');
      }
      
      // Store preference in localStorage
      const isCollapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebar-collapsed', isCollapsed);
    });
    
    // Check if sidebar was collapsed in previous session
    const wasCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    if (wasCollapsed) {
      sidebar.classList.add('collapsed');
      if (mainContent) {
        mainContent.classList.add('expanded');
      }
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
      // Only on mobile view
      if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && !sidebar.classList.contains('collapsed')) {
          sidebar.classList.add('collapsed');
          if (mainContent) {
            mainContent.classList.add('expanded');
          }
        }
      }
    });
  }
  
  // Add active class to current page in sidebar
  const currentPath = window.location.pathname;
  const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  const navLinks = document.querySelectorAll('.nav-links li');
  navLinks.forEach(link => {
    const anchor = link.querySelector('a');
    if (anchor && anchor.getAttribute('href') === fileName) {
      link.classList.add('active');
    }
  });
}

/**
 * Initialize notification functionality
 */
function initNotifications() {
  const notificationToggle = document.querySelector('.notification-bell');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  
  if (notificationToggle && notificationDropdown) {
    notificationToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationDropdown.classList.toggle('active');
      
      // Mark all as read when opening dropdown
      if (notificationDropdown.classList.contains('active')) {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
          setTimeout(() => {
            item.classList.remove('unread');
          }, 3000);
        });
        
        const badge = document.querySelector('.notification-badge');
        if (badge) {
          setTimeout(() => {
            badge.textContent = '0';
            if (badge.textContent === '0') {
              badge.style.display = 'none';
            }
          }, 3000);
        }
      }
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (notificationDropdown.classList.contains('active') &&
          !notificationDropdown.contains(e.target) &&
          !notificationToggle.contains(e.target)) {
        notificationDropdown.classList.remove('active');
      }
    });
    
    // Add click event for "mark all as read"
    const markAllRead = document.querySelector('.mark-all-read');
    if (markAllRead) {
      markAllRead.addEventListener('click', function() {
        const unreadItems = document.querySelectorAll('.notification-item.unread');
        unreadItems.forEach(item => {
          item.classList.remove('unread');
        });
        
        const badge = document.querySelector('.notification-badge');
        if (badge) {
          badge.textContent = '0';
          if (badge.textContent === '0') {
            badge.style.display = 'none';
          }
        }
      });
    }
  }
}

/**
 * Initialize tooltip functionality
 */
function initTooltips() {
  // Find all elements with data-tooltip attribute
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  
  // We don't need to add event listeners for tooltips
  // CSS handles the tooltip display with :hover pseudo-class
}

/**
 * Update last updated timestamps
 */
function updateLastUpdated() {
  const timeElements = document.querySelectorAll('.relative-time');
  
  timeElements.forEach(el => {
    const timestamp = el.getAttribute('data-timestamp');
    if (timestamp) {
      const date = new Date(parseInt(timestamp));
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / 86400000);
      
      let timeText;
      if (diffMins < 1) {
        timeText = 'Just now';
      } else if (diffMins < 60) {
        timeText = `${diffMins}m ago`;
      } else if (diffHours < 24) {
        timeText = `${diffHours}h ago`;
      } else if (diffDays < 30) {
        timeText = `${diffDays}d ago`;
      } else {
        const options = { month: 'short', day: 'numeric' };
        timeText = date.toLocaleDateString(undefined, options);
      }
      
      el.textContent = timeText;
    }
  });
}

/**
 * Handle search functionality
 * @param {string} searchValue - The search query
 * @param {string} containerId - The ID of the container to search within
 * @param {string} itemSelector - The selector for items to search
 */
function handleSearch(searchValue, containerId, itemSelector) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const searchItems = container.querySelectorAll(itemSelector);
  const query = searchValue.toLowerCase().trim();
  
  searchItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(query) || query === '') {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
}

/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: INR)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/**
 * Create a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 * @param {number} duration - How long to display the toast in ms
 */
function showToast(message, type = 'info', duration = 3000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create the toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Add icon based on type
  let icon;
  switch(type) {
    case 'success':
      icon = 'check_circle';
      break;
    case 'error':
      icon = 'error';
      break;
    case 'warning':
      icon = 'warning';
      break;
    default:
      icon = 'info';
  }
  
  toast.innerHTML = `
    <span class="material-icons toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close"><span class="material-icons">close</span></button>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Add close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto-remove after duration
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('toast-hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, duration);
  
  // Show the toast with animation
  setTimeout(() => {
    toast.classList.add('toast-visible');
  }, 10);
}

/**
 * Get URL parameters
 * @returns {Object} Object containing URL parameters
 */
function getUrlParameters() {
  const params = {};
  const queryString = window.location.search.substring(1);
  const pairs = queryString.split('&');
  
  for (let i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    
    const pair = pairs[i].split('=');
    const key = decodeURIComponent(pair[0]);
    const value = pair.length > 1 ? decodeURIComponent(pair[1]) : null;
    
    if (params[key]) {
      // If key already exists, convert to array
      if (!Array.isArray(params[key])) {
        params[key] = [params[key]];
      }
      params[key].push(value);
    } else {
      params[key] = value;
    }
  }
  
  return params;
} 