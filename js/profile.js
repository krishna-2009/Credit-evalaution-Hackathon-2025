// Profile Page JS

document.addEventListener('DOMContentLoaded', function() {
  // Initialize profile page
  initProfilePage();
  
  // Handle profile tab switching
  initProfileTabs();
  
  // Handle theme changes
  document.addEventListener('themeChanged', function() {
    // Update any theme-dependent UI elements
  });
});

// Initialize profile page
function initProfilePage() {
  // Set up avatar upload functionality
  initAvatarUpload();
  
  // Set up ID document viewers
  initDocumentViewers();
  
  // Initialize file upload elements
  initFileUploads();
}

// Initialize profile tabs
function initProfileTabs() {
  const profileTabs = document.querySelectorAll('.profile-tab');
  const profileSections = document.querySelectorAll('.profile-tab-content');
  
  // Add click event to tabs
  profileTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetId = this.dataset.target;
      
      // Remove active class from all tabs and hide all sections
      profileTabs.forEach(t => t.classList.remove('active'));
      profileSections.forEach(s => s.style.display = 'none');
      
      // Add active class to clicked tab and show target section
      this.classList.add('active');
      document.getElementById(targetId).style.display = 'block';
      
      // Save active tab to local storage for persistence
      localStorage.setItem('activeProfileTab', targetId);
    });
  });
  
  // Set initial active tab from local storage or default to first tab
  const activeTabId = localStorage.getItem('activeProfileTab') || profileTabs[0]?.dataset.target;
  if (activeTabId) {
    const activeTab = document.querySelector(`.profile-tab[data-target="${activeTabId}"]`);
    if (activeTab) {
      activeTab.click();
    } else {
      // Fallback to first tab if saved tab doesn't exist
      profileTabs[0]?.click();
    }
  }
}

// Set up avatar upload functionality
function initAvatarUpload() {
  const avatarUploadBtn = document.querySelector('.profile-avatar-edit');
  const avatarInput = document.getElementById('avatarUploadInput');
  const profileAvatar = document.querySelector('.profile-avatar');
  
  if (avatarUploadBtn && avatarInput && profileAvatar) {
    avatarUploadBtn.addEventListener('click', function() {
      avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          profileAvatar.src = e.target.result;
          
          // Here you would typically upload the image to server
          // For now we'll simulate a successful upload
          showToast('Profile picture updated successfully!', 'success');
        };
        
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
}

// Initialize document viewers
function initDocumentViewers() {
  const documentLinks = document.querySelectorAll('.document-view-link');
  
  documentLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const documentId = this.dataset.documentId;
      const documentType = this.dataset.documentType;
      
      // In a real app, you would fetch the document details from server
      // For demo, we'll show a modal with sample content
      showDocumentModal(documentId, documentType);
    });
  });
}

// Show document in modal
function showDocumentModal(documentId, documentType) {
  // Create modal HTML
  const modalHtml = `
    <div class="modal fade" id="documentModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${documentType} Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="document-preview text-center mb-4">
              <img src="assets/sample-${documentType.toLowerCase().replace(/\s/g, '-')}.jpg" 
                   alt="${documentType}" class="img-fluid" style="max-height: 400px;">
            </div>
            <div class="document-details">
              <div class="row mb-3">
                <div class="col-md-4">
                  <span class="detail-label">Document Number</span>
                  <span class="detail-value">XXXX-XXXX-${documentId}</span>
                </div>
                <div class="col-md-4">
                  <span class="detail-label">Issued Date</span>
                  <span class="detail-value">15/06/2020</span>
                </div>
                <div class="col-md-4">
                  <span class="detail-label">Valid Until</span>
                  <span class="detail-value">15/06/2030</span>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <span class="detail-label">Issuing Authority</span>
                  <span class="detail-value">Government of India</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Download</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to the DOM
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHtml;
  document.body.appendChild(modalContainer);
  
  // Initialize and show the modal
  const modal = new bootstrap.Modal(document.getElementById('documentModal'));
  modal.show();
  
  // Clean up when modal is hidden
  document.getElementById('documentModal').addEventListener('hidden.bs.modal', function() {
    document.body.removeChild(modalContainer);
  });
}

// Initialize file upload elements
function initFileUploads() {
  const fileUploadPlaceholders = document.querySelectorAll('.file-upload-placeholder');
  
  fileUploadPlaceholders.forEach(placeholder => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.accept = placeholder.dataset.acceptTypes || 'image/*,.pdf';
    placeholder.appendChild(fileInput);
    
    placeholder.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const fileName = this.files[0].name;
        const uploadType = placeholder.dataset.uploadType || 'Document';
        
        // Update placeholder to show selected file
        placeholder.innerHTML = `
          <div class="file-upload-icon">
            <i class="bi bi-file-earmark-check"></i>
          </div>
          <div class="file-upload-text">${fileName}</div>
          <div class="file-upload-hint">Click to change file</div>
        `;
        
        // Re-append the input element
        placeholder.appendChild(fileInput);
        
        // Show toast notification
        showToast(`${uploadType} selected: ${fileName}`, 'info');
        
        // In a real app, you would upload the file to server here
      }
    });
  });
}

// Helper function to show toast notifications
function showToast(message, type = 'info') {
  // Check if Bootstrap toast is available
  if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Create toast HTML
    const toastHtml = `
      <div class="toast align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    // Add toast to container
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHtml;
    toastContainer.appendChild(toastElement.firstChild);
    
    // Initialize and show the toast
    const toast = new bootstrap.Toast(toastContainer.lastChild);
    toast.show();
    
    // Remove toast after it's hidden
    toastContainer.lastChild.addEventListener('hidden.bs.toast', function() {
      this.remove();
    });
  } else {
    // Fallback to alert if Bootstrap is not available
    console.log(`Toast: ${message} (${type})`);
  }
} 