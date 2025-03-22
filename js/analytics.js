document.addEventListener('DOMContentLoaded', function() {
  initAnalyticsCharts();
  initDateRangeFilter();
  initExportReport();
  initSidebarToggle();
  initNotificationToggle();
});

/**
 * Initialize all charts in the analytics page
 */
function initAnalyticsCharts() {
  initApplicationsTrendChart();
  initLoanDistributionChart();
  initCreditScoreChart();
  initCashFlowChart();
}

/**
 * Create applications trend chart
 */
function initApplicationsTrendChart() {
  const ctx = document.getElementById('applicationsTrendChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'Total Applications',
          data: [65, 72, 86, 81, 90, 103, 95, 112],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Approved Applications',
          data: [42, 55, 66, 62, 73, 82, 76, 88],
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
        title: {
          display: false
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Create loan distribution by purpose chart
 */
function initLoanDistributionChart() {
  const ctx = document.getElementById('loanDistributionChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Crop Loans', 'Equipment Purchase', 'Land Development', 'Irrigation', 'Storage Facility', 'Others'],
      datasets: [
        {
          data: [35, 25, 15, 10, 8, 7],
          backgroundColor: [
            '#4CAF50',
            '#1976D2',
            '#FFC107',
            '#9C27B0',
            '#FF5722',
            '#607D8B'
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 15
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.formattedValue;
              return `${label}: ${value}%`;
            }
          }
        }
      },
      cutout: '60%'
    }
  });
}

/**
 * Create credit score distribution chart
 */
function initCreditScoreChart() {
  const ctx = document.getElementById('creditScoreChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Poor (300-549)', 'Fair (550-649)', 'Good (650-749)', 'Excellent (750-850)'],
      datasets: [
        {
          label: 'Farmer Count',
          data: [62, 148, 253, 87],
          backgroundColor: [
            '#F44336',
            '#FFC107',
            '#4CAF50',
            '#1976D2'
          ],
          borderWidth: 0,
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.formattedValue;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Number of Farmers'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Create cash flow chart
 */
function initCashFlowChart() {
  const ctx = document.getElementById('cashFlowChart');
  if (!ctx) return;
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'Disbursed Amount',
          data: [2.4, 2.8, 3.1, 2.6, 3.4, 3.7, 3.2, 3.9],
          backgroundColor: '#4CAF50',
          borderWidth: 0,
          borderRadius: 5
        },
        {
          label: 'Repaid Amount',
          data: [1.8, 2.1, 2.4, 2.2, 2.7, 2.9, 2.6, 3.0],
          backgroundColor: '#1976D2',
          borderWidth: 0,
          borderRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || '';
              const value = context.formattedValue;
              return `${label}: ₹${value} Cr`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          title: {
            display: true,
            text: 'Amount (₹ Crores)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

/**
 * Initialize date range filter functionality
 */
function initDateRangeFilter() {
  const dateRangeSelect = document.getElementById('dateRangeSelect');
  
  if (dateRangeSelect) {
    dateRangeSelect.addEventListener('change', function() {
      const value = this.value;
      
      if (value === 'custom') {
        // Show custom date picker (simplified for this example)
        const startDate = prompt('Enter start date (YYYY-MM-DD):', '2023-01-01');
        const endDate = prompt('Enter end date (YYYY-MM-DD):', '2023-08-31');
        
        if (startDate && endDate) {
          updateChartsByDateRange(startDate, endDate);
          showToast('Custom date range applied', 'info');
        } else {
          // Reset to default if cancelled
          dateRangeSelect.value = 'last-30-days';
        }
      } else {
        // Handle predefined ranges
        let startDate, endDate;
        const today = new Date();
        
        switch(value) {
          case 'last-30-days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 30);
            endDate = today;
            break;
          case 'last-90-days':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - 90);
            endDate = today;
            break;
          case 'last-6-months':
            startDate = new Date(today);
            startDate.setMonth(today.getMonth() - 6);
            endDate = today;
            break;
          case 'last-year':
            startDate = new Date(today);
            startDate.setFullYear(today.getFullYear() - 1);
            endDate = today;
            break;
        }
        
        updateChartsByDateRange(formatDate(startDate), formatDate(endDate));
        showToast(`Date range updated: ${value.replace(/-/g, ' ')}`, 'info');
      }
    });
  }
}

/**
 * Update all charts based on date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 */
function updateChartsByDateRange(startDate, endDate) {
  // In a real application, this would fetch data for the selected date range
  // and update the charts. For this example, we'll just show a mock update.
  
  // Simulate data loading
  showToast('Loading analytics data...', 'info');
  
  // For demonstration, we're just waiting and not actually updating the charts
  setTimeout(() => {
    showToast(`Analytics updated for period: ${startDate} to ${endDate}`, 'success');
  }, 1500);
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Initialize export report functionality
 */
function initExportReport() {
  const exportBtn = document.getElementById('exportReportBtn');
  
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      showToast('Generating analytics report...', 'info');
      
      // Simulate report generation
      setTimeout(() => {
        showToast('Analytics report has been downloaded', 'success');
      }, 2000);
    });
  }
}

/* --- UI Error Fixes for Analytics Page --- */

/**
 * Initialize sidebar toggle functionality.
 * This collapses/expands the sidebar when the toggle button is clicked.
 */
function initSidebarToggle() {
  const sidebarToggleBtn = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      // Optionally, adjust main-content margin if needed:
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        if (sidebar.classList.contains('collapsed')) {
          mainContent.style.marginLeft = '70px';
        } else {
          mainContent.style.marginLeft = '250px';
        }
      }
    });
  }
}

/**
 * Initialize notification dropdown toggle.
 * Hides the notification dropdown on load and toggles its visibility on bell click.
 */
function initNotificationToggle() {
  const notificationBell = document.querySelector('.notification-bell');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  
  // Hide the dropdown initially
  if (notificationDropdown) {
    notificationDropdown.style.display = 'none';
  }
  
  if (notificationBell && notificationDropdown) {
    notificationBell.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event bubbling
      
      if (notificationDropdown.style.display === 'none' || notificationDropdown.style.display === '') {
        notificationDropdown.style.display = 'block';
      } else {
        notificationDropdown.style.display = 'none';
      }
    });
    
    // Hide dropdown if clicked outside
    document.addEventListener('click', function(e) {
      if (!notificationDropdown.contains(e.target) && !notificationBell.contains(e.target)) {
        notificationDropdown.style.display = 'none';
      }
    });
  }
}

