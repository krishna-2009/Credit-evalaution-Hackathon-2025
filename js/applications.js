document.addEventListener('DOMContentLoaded', function() {
  initApplicationFilters();
  initApplicationActions();
  initTableCheckboxes();
  initSortingBehavior();
  initPaginationControls();
  initApplicationsPage();
});

/**
 * Initialize filters for applications table
 */
function initApplicationFilters() {
  const statusFilter = document.getElementById('statusFilter');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const minAmount = document.getElementById('minAmount');
  const maxAmount = document.getElementById('maxAmount');
  const searchInput = document.getElementById('applicationSearch');
  const clearFiltersBtn = document.getElementById('clearFilters');
  
  // Add event listeners to filters
  if (statusFilter) {
    statusFilter.addEventListener('change', applyFilters);
  }
  
  if (startDate && endDate) {
    startDate.addEventListener('change', applyFilters);
    endDate.addEventListener('change', applyFilters);
  }
  
  if (minAmount && maxAmount) {
    minAmount.addEventListener('input', applyFilters);
    maxAmount.addEventListener('input', applyFilters);
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      applyFilters();
    });
  }
  
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearFilters);
  }
}

/**
 * Apply filters to the applications table
 */
function applyFilters() {
  const statusFilter = document.getElementById('statusFilter');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const minAmount = document.getElementById('minAmount');
  const maxAmount = document.getElementById('maxAmount');
  const searchInput = document.getElementById('applicationSearch');
  const table = document.getElementById('applicationsTable');
  
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;
  
  rows.forEach(row => {
    let showRow = true;
    
    // Status filter
    if (statusFilter && statusFilter.value) {
      const statusCell = row.querySelector('td:nth-child(7)');
      const statusBadge = statusCell ? statusCell.querySelector('.status-badge') : null;
      if (statusBadge && !statusBadge.classList.contains(statusFilter.value)) {
        showRow = false;
      }
    }
    
    // Date filter
    if (startDate && startDate.value) {
      const dateCell = row.querySelector('td:nth-child(6)');
      if (dateCell) {
        const rowDate = new Date(dateCell.textContent);
        const filterDate = new Date(startDate.value);
        if (rowDate < filterDate) {
          showRow = false;
        }
      }
    }
    
    if (endDate && endDate.value) {
      const dateCell = row.querySelector('td:nth-child(6)');
      if (dateCell) {
        const rowDate = new Date(dateCell.textContent);
        const filterDate = new Date(endDate.value);
        if (rowDate > filterDate) {
          showRow = false;
        }
      }
    }
    
    // Amount filter
    if (minAmount && minAmount.value) {
      const amountCell = row.querySelector('td:nth-child(4)');
      if (amountCell) {
        const rowAmount = parseInt(amountCell.textContent.replace(/[^\d]/g, ''));
        if (rowAmount < parseInt(minAmount.value)) {
          showRow = false;
        }
      }
    }
    
    if (maxAmount && maxAmount.value) {
      const amountCell = row.querySelector('td:nth-child(4)');
      if (amountCell) {
        const rowAmount = parseInt(amountCell.textContent.replace(/[^\d]/g, ''));
        if (rowAmount > parseInt(maxAmount.value)) {
          showRow = false;
        }
      }
    }
    
    // Search filter
    if (searchInput && searchInput.value.trim()) {
      const searchText = searchInput.value.toLowerCase().trim();
      const rowText = row.textContent.toLowerCase();
      if (!rowText.includes(searchText)) {
        showRow = false;
      }
    }
    
    // Show or hide the row
    if (showRow) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  });
  
  // Update results count
  const tableInfo = document.querySelector('.table-info');
  if (tableInfo) {
    tableInfo.innerHTML = `<span>Showing <strong>${visibleCount}</strong> of <strong>${rows.length}</strong> applications</span>`;
  }
  
  updatePaginationInfo(visibleCount);
}

/**
 * Clear all filters
 */
function clearFilters() {
  const statusFilter = document.getElementById('statusFilter');
  const startDate = document.getElementById('startDate');
  const endDate = document.getElementById('endDate');
  const minAmount = document.getElementById('minAmount');
  const maxAmount = document.getElementById('maxAmount');
  const searchInput = document.getElementById('applicationSearch');
  
  if (statusFilter) statusFilter.value = '';
  if (startDate) startDate.value = '';
  if (endDate) endDate.value = '';
  if (minAmount) minAmount.value = '';
  if (maxAmount) maxAmount.value = '';
  if (searchInput) searchInput.value = '';
  
  applyFilters();
  showToast('Filters have been cleared', 'info');
}

/**
 * Initialize action buttons for applications
 */
function initApplicationActions() {
  // View application details
  const viewButtons = document.querySelectorAll('.action-btn[data-tooltip="View details"]');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const appId = row.querySelector('td:nth-child(2)').textContent;
      showToast(`Viewing application ${appId}`, 'info');
      // Implement view functionality
    });
  });
  
  // Edit application
  const editButtons = document.querySelectorAll('.action-btn[data-tooltip="Edit application"]');
  editButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const appId = row.querySelector('td:nth-child(2)').textContent;
      showToast(`Editing application ${appId}`, 'info');
      // Implement edit functionality
    });
  });
  
  // Delete application
  const deleteButtons = document.querySelectorAll('.action-btn[data-tooltip="Delete application"]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function() {
      const row = this.closest('tr');
      const appId = row.querySelector('td:nth-child(2)').textContent;
      
      if (confirm(`Are you sure you want to delete application ${appId}?`)) {
        row.remove();
        updateTableCounts();
        showToast(`Application ${appId} has been deleted`, 'success');
      }
    });
  });
  
  // New application button
  const newAppBtn = document.getElementById('newApplicationBtn');
  if (newAppBtn) {
    newAppBtn.addEventListener('click', function() {
      window.location.href = 'evaluate-farmer.html';
    });
  }
  
  // Export button
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      showToast('Exporting applications data to CSV...', 'info');
      setTimeout(() => {
        showToast('Applications data exported successfully', 'success');
      }, 1500);
    });
  }
}

/**
 * Initialize table checkboxes functionality
 */
function initTableCheckboxes() {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.application-checkbox');
  
  if (selectAll) {
    selectAll.addEventListener('change', function() {
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });
  }
  
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      // Check if all checkboxes are checked
      const allChecked = [...checkboxes].every(cb => cb.checked);
      const someChecked = [...checkboxes].some(cb => cb.checked);
      
      if (selectAll) {
        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
      }
    });
  });
}

/**
 * Initialize sorting behavior for applications table
 */
function initSortingBehavior() {
  const sortSelect = document.getElementById('sortBy');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      sortApplications(this.value);
    });
  }
}

/**
 * Sort applications based on selected criteria
 * @param {string} sortOption - The sort option value
 */
function sortApplications(sortOption) {
  const table = document.getElementById('applicationsTable');
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    switch (sortOption) {
      case 'date-desc':
        return compareDates(b, a, 5);
      case 'date-asc':
        return compareDates(a, b, 5);
      case 'amount-desc':
        return compareAmounts(b, a, 3);
      case 'amount-asc':
        return compareAmounts(a, b, 3);
      case 'name-asc':
        return compareText(a, b, 2);
      case 'name-desc':
        return compareText(b, a, 2);
      default:
        return 0;
    }
  });
  
  // Remove existing rows
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
  
  // Add sorted rows
  rows.forEach(row => {
    tbody.appendChild(row);
  });
  
  showToast('Applications sorted successfully', 'info');
}

/**
 * Compare dates for sorting
 * @param {Element} a - First row
 * @param {Element} b - Second row
 * @param {number} colIndex - Index of the column to compare
 * @returns {number} Comparison result
 */
function compareDates(a, b, colIndex) {
  const dateA = new Date(a.querySelector(`td:nth-child(${colIndex})`).textContent);
  const dateB = new Date(b.querySelector(`td:nth-child(${colIndex})`).textContent);
  return dateA - dateB;
}

/**
 * Compare amounts for sorting
 * @param {Element} a - First row
 * @param {Element} b - Second row
 * @param {number} colIndex - Index of the column to compare
 * @returns {number} Comparison result
 */
function compareAmounts(a, b, colIndex) {
  const amountA = parseInt(a.querySelector(`td:nth-child(${colIndex})`).textContent.replace(/[^\d]/g, ''));
  const amountB = parseInt(b.querySelector(`td:nth-child(${colIndex})`).textContent.replace(/[^\d]/g, ''));
  return amountA - amountB;
}

/**
 * Compare text for sorting
 * @param {Element} a - First row
 * @param {Element} b - Second row
 * @param {number} colIndex - Index of the column to compare
 * @returns {number} Comparison result
 */
function compareText(a, b, colIndex) {
  const textA = a.querySelector(`td:nth-child(${colIndex})`).textContent.toLowerCase();
  const textB = b.querySelector(`td:nth-child(${colIndex})`).textContent.toLowerCase();
  return textA.localeCompare(textB);
}

/**
 * Initialize pagination controls
 */
function initPaginationControls() {
  const pageItems = document.querySelectorAll('.page-item:not(.disabled)');
  const prevButton = document.querySelector('.page-item:first-child .page-link');
  const nextButton = document.querySelector('.page-item:last-child .page-link');
  
  if (pageItems.length) {
    pageItems.forEach(item => {
      if (!item.classList.contains('disabled')) {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Skip if this is the first or last item (prev/next buttons)
          const link = this.querySelector('.page-link');
          if (link && (link.getAttribute('aria-label') === 'Previous' || link.getAttribute('aria-label') === 'Next')) {
            return;
          }
          
          // Remove active class from all items
          pageItems.forEach(el => el.classList.remove('active'));
          
          // Add active class to clicked item
          this.classList.add('active');
          
          // Update pagination info
          const pageNumber = link?.textContent;
          if (pageNumber && !isNaN(parseInt(pageNumber))) {
            updatePaginationInfo();
            showToast(`Showing page ${pageNumber}`, 'info');
          }
        });
      }
    });
  }
  
  // Previous button functionality
  if (prevButton) {
    prevButton.addEventListener('click', function(e) {
      e.preventDefault();
      const activeItem = document.querySelector('.page-item.active');
      if (activeItem && activeItem.previousElementSibling && 
          !activeItem.previousElementSibling.classList.contains('disabled')) {
        const prevItem = activeItem.previousElementSibling;
        // Skip the first item (prev button)
        if (prevItem.querySelector('.page-link').getAttribute('aria-label') !== 'Previous') {
          prevItem.click();
        }
      }
    });
  }
  
  // Next button functionality
  if (nextButton) {
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      const activeItem = document.querySelector('.page-item.active');
      if (activeItem && activeItem.nextElementSibling) {
        const nextItem = activeItem.nextElementSibling;
        // Skip the last item (next button)
        if (nextItem.querySelector('.page-link').getAttribute('aria-label') !== 'Next') {
          nextItem.click();
        }
      }
    });
  }
  
  // Update pagination info initially
  updatePaginationInfo();
}

/**
 * Update pagination information
 * @param {number} visibleCount - Number of visible rows
 */
function updatePaginationInfo(visibleCount) {
  const paginationInfo = document.querySelector('.pagination-info');
  
  if (!paginationInfo) return;
  
  const totalItems = visibleCount || document.querySelectorAll('#applicationsTable tbody tr').length;
  const perPage = 10; // Default to 10 items per page
  const activeItem = document.querySelector('.page-item.active');
  const currentPage = activeItem ? parseInt(activeItem.querySelector('.page-link').textContent) : 1;
  
  const start = Math.min((currentPage - 1) * perPage + 1, totalItems);
  const end = Math.min(currentPage * perPage, totalItems);
  
  paginationInfo.textContent = `Showing ${start} to ${end} of ${totalItems} entries`;
}

/**
 * Update table counts after row changes
 */
function updateTableCounts() {
  const rows = document.querySelectorAll('#applicationsTable tbody tr');
  const visibleRows = [...rows].filter(row => row.style.display !== 'none');
  
  // Update table info
  const tableInfo = document.querySelector('.table-info');
  if (tableInfo) {
    tableInfo.innerHTML = `<span>Showing <strong>${visibleRows.length}</strong> of <strong>${rows.length}</strong> applications</span>`;
  }
  
  updatePaginationInfo(visibleRows.length);
}

// Applications page functionality
function initApplicationsPage() {
  // Load applications data (simulated)
  loadApplications();
  
  // Set up theme-related listeners
  document.addEventListener('themeChanged', function() {
    // Update any theme-dependent UI elements
  });
}

// Apply filters to the applications list
function applyFilters() {
  const formData = new FormData(document.getElementById('applicationFilterForm'));
  
  // Get filter values
  const filters = {
    status: formData.get('status') || '',
    applicantName: formData.get('applicantName') || '',
    dateFrom: formData.get('dateFrom') || '',
    dateTo: formData.get('dateTo') || '',
    loanType: formData.get('loanType') || '',
    amount: formData.get('amount') || '',
    village: formData.get('village') || ''
  };
  
  // Apply filters to the applications (simulated)
  const filteredApplications = getApplications().filter(app => {
    // Status filter
    if (filters.status && app.status !== filters.status) {
      return false;
    }
    
    // Applicant name filter (partial match)
    if (filters.applicantName && !app.applicantName.toLowerCase().includes(filters.applicantName.toLowerCase())) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom) {
      const dateFrom = new Date(filters.dateFrom);
      const appDate = new Date(app.applicationDate);
      if (appDate < dateFrom) {
        return false;
      }
    }
    
    if (filters.dateTo) {
      const dateTo = new Date(filters.dateTo);
      const appDate = new Date(app.applicationDate);
      if (appDate > dateTo) {
        return false;
      }
    }
    
    // Loan type filter
    if (filters.loanType && app.loanType !== filters.loanType) {
      return false;
    }
    
    // Amount filter (greater than or equal)
    if (filters.amount && parseFloat(app.amount) < parseFloat(filters.amount)) {
      return false;
    }
    
    // Village filter
    if (filters.village && app.village !== filters.village) {
      return false;
    }
    
    return true;
  });
  
  // Update UI with filtered applications
  renderApplications(filteredApplications);
  
  // Show filter summary
  updateFilterSummary(filters);
}

// Reset all filters
function resetFilters() {
  const filterForm = document.getElementById('applicationFilterForm');
  if (filterForm) {
    filterForm.reset();
    applyFilters();
  }
}

// Update filter summary display
function updateFilterSummary(filters) {
  const filterSummary = document.getElementById('filterSummary');
  if (!filterSummary) return;
  
  // Count active filters
  const activeFilters = Object.values(filters).filter(val => val !== '').length;
  
  if (activeFilters > 0) {
    // Create summary text
    let summaryText = `${activeFilters} filter${activeFilters > 1 ? 's' : ''} applied`;
    
    // Add some filter details
    const filterDetails = [];
    
    if (filters.status) {
      filterDetails.push(`Status: ${filters.status}`);
    }
    
    if (filters.applicantName) {
      filterDetails.push(`Name: ${filters.applicantName}`);
    }
    
    if (filters.loanType) {
      filterDetails.push(`Loan Type: ${filters.loanType}`);
    }
    
    if (filterDetails.length > 0) {
      summaryText += ` (${filterDetails.join(', ')})`;
    }
    
    filterSummary.textContent = summaryText;
    filterSummary.style.display = 'block';
  } else {
    filterSummary.style.display = 'none';
  }
}

// Simulated data loading
function loadApplications() {
  const applications = getApplications();
  renderApplications(applications);
}

// Render applications to the UI
function renderApplications(applications) {
  const applicationsContainer = document.getElementById('applicationsContainer');
  if (!applicationsContainer) return;
  
  if (applications.length === 0) {
    // Show empty state
    applicationsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="bi bi-folder-x"></i>
        </div>
        <h5 class="empty-state-title">No applications found</h5>
        <p class="empty-state-text">No applications match your current filters. Try adjusting your filter criteria or create a new application.</p>
        <button class="btn btn-primary">Create New Application</button>
      </div>
    `;
    return;
  }
  
  // Create application cards
  let html = '';
  
  applications.forEach(app => {
    html += `
      <div class="application-card">
        <div class="application-card-header">
          <div>
            <h5 class="application-card-title">${app.applicantName}</h5>
            <div class="application-card-id">#${app.id}</div>
          </div>
          <span class="application-card-status status-${app.status.toLowerCase()}">${app.status}</span>
        </div>
        <div class="application-card-content">
          <div class="application-card-info">
            <div class="info-row">
              <div class="info-label">Loan Type</div>
              <div class="info-value">${app.loanType}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Amount</div>
              <div class="info-value">₹${app.amount.toLocaleString()}</div>
            </div>
          </div>
          <div class="application-card-info">
            <div class="info-row">
              <div class="info-label">Application Date</div>
              <div class="info-value">${formatDate(app.applicationDate)}</div>
            </div>
            <div class="info-row">
              <div class="info-label">Village</div>
              <div class="info-value">${app.village}</div>
            </div>
          </div>
        </div>
        <div class="application-card-actions">
          <button class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-eye me-1"></i> View
          </button>
          <button class="btn btn-sm btn-primary">
            <i class="bi bi-pencil me-1"></i> Edit
          </button>
        </div>
      </div>
    `;
  });
  
  applicationsContainer.innerHTML = html;
  
  // Update pagination info
  updatePaginationInfo(applications.length);
}

// Initialize pagination
function initPagination() {
  const pageBtns = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
  const prevBtn = document.querySelector('.page-btn.prev');
  const nextBtn = document.querySelector('.page-btn.next');
  
  // Set current page
  let currentPage = 1;
  
  pageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      pageBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get page number
      currentPage = parseInt(this.dataset.page || this.textContent);
      
      // Load page data (simulated)
      loadApplications();
    });
  });
  
  // Previous page button
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        
        // Activate corresponding page button
        pageBtns.forEach(btn => {
          const pageNum = parseInt(btn.dataset.page || btn.textContent);
          if (pageNum === currentPage) {
            btn.click();
          }
        });
      }
    });
  }
  
  // Next page button
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      const maxPage = pageBtns.length;
      if (currentPage < maxPage) {
        currentPage++;
        
        // Activate corresponding page button
        pageBtns.forEach(btn => {
          const pageNum = parseInt(btn.dataset.page || btn.textContent);
          if (pageNum === currentPage) {
            btn.click();
          }
        });
      }
    });
  }
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

// Simulated data source
function getApplications() {
  // Sample application data
  return [
    {
      id: 'APP-2023-001',
      applicantName: 'Rajesh Kumar',
      status: 'Approved',
      loanType: 'Crop Loan',
      amount: 75000,
      applicationDate: '2023-05-15',
      village: 'Dharampur'
    },
    {
      id: 'APP-2023-002',
      applicantName: 'Anita Devi',
      status: 'Pending',
      loanType: 'Equipment Purchase',
      amount: 125000,
      applicationDate: '2023-05-18',
      village: 'Bhimtal'
    },
    {
      id: 'APP-2023-003',
      applicantName: 'Sunil Verma',
      status: 'Rejected',
      loanType: 'Land Development',
      amount: 200000,
      applicationDate: '2023-05-10',
      village: 'Rampur'
    },
    {
      id: 'APP-2023-004',
      applicantName: 'Meera Singh',
      status: 'Approved',
      loanType: 'Irrigation',
      amount: 90000,
      applicationDate: '2023-05-05',
      village: 'Naukuchia'
    },
    {
      id: 'APP-2023-005',
      applicantName: 'Prakash Joshi',
      status: 'Draft',
      loanType: 'Crop Loan',
      amount: 50000,
      applicationDate: '2023-05-20',
      village: 'Dharampur'
    },
    {
      id: 'APP-2023-006',
      applicantName: 'Lakshmi Devi',
      status: 'Pending',
      loanType: 'Livestock',
      amount: 85000,
      applicationDate: '2023-05-12',
      village: 'Jeolikot'
    },
    {
      id: 'APP-2023-007',
      applicantName: 'Ravi Tiwari',
      status: 'Approved',
      loanType: 'Equipment Purchase',
      amount: 150000,
      applicationDate: '2023-05-08',
      village: 'Rampur'
    }
  ];
} 