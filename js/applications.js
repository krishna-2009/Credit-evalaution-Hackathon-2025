document.addEventListener('DOMContentLoaded', function() {
  initApplicationFilters();
  initApplicationActions();
  initTableCheckboxes();
  initSortingBehavior();
  initPaginationControls();
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
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  const rowsPerPage = document.getElementById('rowsPerPage');
  
  if (paginationButtons.length) {
    paginationButtons.forEach(button => {
      if (!button.disabled && !button.querySelector('.material-icons')) {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          paginationButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          // Update pagination info
          const pageNumber = parseInt(this.textContent);
          updatePaginationInfo();
          
          showToast(`Showing page ${pageNumber}`, 'info');
        });
      }
    });
  }
  
  if (rowsPerPage) {
    rowsPerPage.addEventListener('change', function() {
      const value = this.value;
      showToast(`Showing ${value} rows per page`, 'info');
      updatePaginationInfo();
    });
  }
}

/**
 * Update pagination information
 * @param {number} visibleCount - Number of visible rows
 */
function updatePaginationInfo(visibleCount) {
  const paginationInfo = document.querySelector('.pagination-info');
  const rowsPerPage = document.getElementById('rowsPerPage');
  
  if (!paginationInfo) return;
  
  const totalItems = visibleCount || document.querySelectorAll('#applicationsTable tbody tr').length;
  const perPage = rowsPerPage ? parseInt(rowsPerPage.value) : 10;
  const activeButton = document.querySelector('.pagination-btn.active');
  const currentPage = activeButton ? parseInt(activeButton.textContent) : 1;
  
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);
  
  paginationInfo.innerHTML = `<span>Showing ${start}-${end} of ${totalItems} applications</span>`;
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