document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings tabs
    initSettingsTabs();
    
    // Initialize form submissions
    initFormSubmissions();
    
    // Initialize toggle switches
    initToggleSwitches();
});

/**
 * Initialize settings tabs navigation
 */
function initSettingsTabs() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Remove active class from all nav items and sections
            navItems.forEach(navItem => navItem.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav item and corresponding section
            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');
            
            // Add to browser history for direct linking
            history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Check for hash in URL to activate correct tab
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetNavItem = document.querySelector(`.settings-nav-item[data-target="${targetId}"]`);
        if (targetNavItem) {
            targetNavItem.click();
        }
    }
}

/**
 * Initialize form submissions with validation
 */
function initFormSubmissions() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', function() {
            if (validateProfileForm()) {
                // Simulate saving profile data
                showToast('Profile information updated successfully', 'success');
            }
        });
    }
    
    // Regional settings form
    const saveRegionalBtn = document.getElementById('saveRegionalBtn');
    
    if (saveRegionalBtn) {
        saveRegionalBtn.addEventListener('click', function() {
            // Simulate saving regional settings
            showToast('Regional settings updated successfully', 'success');
        });
    }
    
    // Password form
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', function() {
            if (validatePasswordForm()) {
                // Simulate password update
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmPassword').value = '';
                showToast('Password updated successfully', 'success');
            }
        });
    }
    
    // Notification preferences
    const saveNotificationBtn = document.getElementById('saveNotificationBtn');
    
    if (saveNotificationBtn) {
        saveNotificationBtn.addEventListener('click', function() {
            // Simulate saving notification preferences
            showToast('Notification preferences saved', 'success');
        });
    }
    
    // Application settings
    const saveAppSettingsBtn = document.getElementById('saveAppSettingsBtn');
    const resetAppSettingsBtn = document.getElementById('resetAppSettingsBtn');
    
    if (saveAppSettingsBtn) {
        saveAppSettingsBtn.addEventListener('click', function() {
            // Simulate saving application settings
            showToast('Application settings saved', 'success');
        });
    }
    
    if (resetAppSettingsBtn) {
        resetAppSettingsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all settings to default values?')) {
                // Simulate resetting settings
                showToast('Settings have been reset to defaults', 'info');
            }
        });
    }
    
    // Issue form
    const submitIssueBtn = document.getElementById('submitIssueBtn');
    
    if (submitIssueBtn) {
        submitIssueBtn.addEventListener('click', function() {
            if (validateIssueForm()) {
                // Simulate issue submission
                document.getElementById('issueType').value = '';
                document.getElementById('issueTitle').value = '';
                document.getElementById('issueDescription').value = '';
                document.getElementById('issueAttachment').value = '';
                showToast('Your issue has been submitted. Support team will contact you soon.', 'success');
            }
        });
    }
}

/**
 * Validate profile form
 */
function validateProfileForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (fullName === '') {
        showToast('Please enter your full name', 'error');
        return false;
    }
    
    if (email === '') {
        showToast('Please enter your email address', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    
    if (phone === '') {
        showToast('Please enter your phone number', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validate password form
 */
function validatePasswordForm() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (currentPassword === '') {
        showToast('Please enter your current password', 'error');
        return false;
    }
    
    if (newPassword === '') {
        showToast('Please enter a new password', 'error');
        return false;
    }
    
    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters long', 'error');
        return false;
    }
    
    if (confirmPassword === '') {
        showToast('Please confirm your new password', 'error');
        return false;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
    }
    
    return true;
}

/**
 * Validate issue form
 */
function validateIssueForm() {
    const issueType = document.getElementById('issueType').value;
    const issueTitle = document.getElementById('issueTitle').value.trim();
    const issueDescription = document.getElementById('issueDescription').value.trim();
    
    if (issueType === '') {
        showToast('Please select an issue type', 'error');
        return false;
    }
    
    if (issueTitle === '') {
        showToast('Please enter an issue title', 'error');
        return false;
    }
    
    if (issueDescription === '') {
        showToast('Please provide a description of the issue', 'error');
        return false;
    }
    
    if (issueDescription.length < 20) {
        showToast('Please provide a more detailed description', 'error');
        return false;
    }
    
    return true;
}

/**
 * Initialize toggle switches
 */
function initToggleSwitches() {
    const toggleSwitches = document.querySelectorAll('.switch input[type="checkbox"]');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.closest('.setting-row').querySelector('h4, h5').textContent;
            const status = this.checked ? 'enabled' : 'disabled';
            
            showToast(`${settingName} ${status}`, 'info');
        });
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Check if toast container exists, if not create it
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Create icon based on type
    let icon = 'info';
    switch (type) {
        case 'success':
            icon = 'check_circle';
            break;
        case 'error':
            icon = 'error';
            break;
        case 'warning':
            icon = 'warning';
            break;
    }
    
    // Create toast content
    toast.innerHTML = `
        <span class="material-icons">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">
            <span class="material-icons">close</span>
        </button>
    `;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Add active class after a small delay for animation
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // Setup close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.classList.remove('active');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('active');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Email validation helper
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 