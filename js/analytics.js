document.addEventListener('DOMContentLoaded', function() {
  initAnalyticsCharts();
  initDateRangeFilter();
  initExportReport();
  initSidebarToggle();
  initNotificationToggle();
  initDateRangePicker();
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
          data: [65, 80, 87, 78, 85, 95, 90, 105],
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Approved Applications',
          data: [45, 55, 65, 60, 68, 75, 70, 85],
          borderColor: '#1976D2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: getChartOptions('Number of Applications')
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
      labels: ['Crop Loan', 'Equipment Purchase', 'Land Development', 'Irrigation', 'Livestock'],
      datasets: [
        {
          data: [45, 25, 15, 10, 5],
          backgroundColor: [
            '#4CAF50', '#1976D2', '#FFC107', '#9C27B0', '#FF5722'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            font: {
              family: 'Poppins'
            },
            color: getCssVariable('--text-color')
          }
        },
        title: {
          display: false
        }
      }
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
      labels: ['Below 600', '600-650', '650-700', '700-750', 'Above 750'],
      datasets: [
        {
          label: 'Farmers',
          data: [15, 30, 40, 25, 10],
          backgroundColor: [
            '#F44336', '#FF9800', '#FFC107', '#8BC34A', '#4CAF50'
          ]
        }
      ]
    },
    options: getChartOptions('Number of Farmers')
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
          label: 'Disbursements',
          data: [120, 150, 180, 155, 140, 175, 165, 190],
          backgroundColor: '#4CAF50'
        },
        {
          label: 'Repayments',
          data: [80, 95, 110, 115, 120, 130, 135, 145],
          backgroundColor: '#1976D2'
        }
      ]
    },
    options: getChartOptions('Amount (₹ thousand)')
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

function initDateRangePicker() {
  const dateRangeSelect = document.getElementById('dateRangeSelect');
  const customDateInputs = document.getElementById('customDateInputs');
  
  if (dateRangeSelect) {
    dateRangeSelect.addEventListener('change', function() {
      // Show custom date inputs if "Custom Range" is selected
      if (this.value === 'custom' && customDateInputs) {
        customDateInputs.style.display = 'flex';
      } else if (customDateInputs) {
        customDateInputs.style.display = 'none';
      }
    });
    
    // Trigger initial state
    if (dateRangeSelect.value === 'custom' && customDateInputs) {
      customDateInputs.style.display = 'flex';
    } else if (customDateInputs) {
      customDateInputs.style.display = 'none';
    }
  }
}

// Helper function to get CSS variable value
function getCssVariable(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

// Common chart options
function getChartOptions(yAxisLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            family: 'Poppins',
            size: 12
          },
          color: getCssVariable('--text-color')
        }
      },
      tooltip: {
        bodyFont: {
          family: 'Poppins',
          size: 14
        },
        titleFont: {
          family: 'Poppins',
          size: 14,
          weight: 'bold'
        },
        padding: 10,
        backgroundColor: getCssVariable('--card-bg'),
        titleColor: getCssVariable('--text-color'),
        bodyColor: getCssVariable('--text-color'),
        borderColor: getCssVariable('--border-color'),
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: getCssVariable('--text-color'),
          font: {
            family: 'Poppins',
            size: 12
          },
          padding: 8
        },
        grid: {
          color: getCssVariable('--gray-200'),
          drawBorder: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          color: getCssVariable('--text-color'),
          font: {
            family: 'Poppins',
            size: 14,
            weight: 'bold'
          },
          padding: {
            bottom: 10
          }
        },
        ticks: {
          color: getCssVariable('--text-color'),
          font: {
            family: 'Poppins',
            size: 12
          },
          padding: 8
        },
        grid: {
          color: getCssVariable('--gray-200'),
          drawBorder: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    layout: {
      padding: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 10
      }
    }
  };
}

// Refresh charts when theme changes
function refreshCharts() {
  Chart.instances.forEach(chart => {
    if (chart.options.scales) {
      // Update scales colors
      if (chart.options.scales.x) {
        chart.options.scales.x.ticks.color = getCssVariable('--text-color');
        chart.options.scales.x.grid.color = getCssVariable('--gray-200');
      }
      if (chart.options.scales.y) {
        chart.options.scales.y.ticks.color = getCssVariable('--text-color');
        chart.options.scales.y.grid.color = getCssVariable('--gray-200');
        if (chart.options.scales.y.title) {
          chart.options.scales.y.title.color = getCssVariable('--text-color');
        }
      }
    }
    
    // Update legend colors
    if (chart.options.plugins && chart.options.plugins.legend) {
      chart.options.plugins.legend.labels.color = getCssVariable('--text-color');
    }
    
    chart.update();
  });
}

