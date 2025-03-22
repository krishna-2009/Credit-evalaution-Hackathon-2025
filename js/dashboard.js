// Update weather information
function updateWeather() {
    // This would typically fetch from a weather API
    const weatherInfo = {
        temperature: 28,
        condition: 'Sunny',
        humidity: 65
    };

    document.querySelector('.temp').textContent = `${weatherInfo.temperature}°C`;
    document.querySelector('.weather-info p').textContent = 
        `${weatherInfo.condition} | Humidity: ${weatherInfo.humidity}%`;
}

// Update credit score animation
function animateCreditScore() {
    const score = document.querySelector('.score');
    const targetScore = 750;
    let currentScore = 0;

    const interval = setInterval(() => {
        if (currentScore >= targetScore) {
            clearInterval(interval);
            return;
        }
        currentScore += 5;
        score.textContent = currentScore;
    }, 20);
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initializeCreditScoreChart();
    
    // Setup tooltips
    setupTooltips();
    
    // Simulate real-time data updates
    setInterval(updateStatistics, 30000);
    
    // Add event listeners
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', handleApplicationAction);
    });
    
    // Setup search functionality
    setupSearch();
    
    // Initialize notifications
    initializeNotifications();

    updateWeather();
    animateCreditScore();

    // Add active class to current nav item
    const currentPage = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage.split('/').pop()) {
            link.parentElement.classList.add('active');
        }
    });
});

// Initialize credit score distribution chart
function initializeCreditScoreChart() {
    const ctx = document.getElementById('creditDistributionChart').getContext('2d');
    
    const creditChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Excellent (750+)', 'Good (670-749)', 'Fair (580-669)', 'Poor (300-579)'],
            datasets: [{
                data: [25, 40, 20, 15],
                backgroundColor: [
                    '#4CAF50', // Green - Excellent
                    '#1976D2', // Blue - Good
                    '#FF9800', // Orange - Fair
                    '#F44336'  // Red - Poor
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

// Setup tooltips for better user experience
function setupTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = trigger.getAttribute('data-tooltip');
        
        trigger.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            const rect = trigger.getBoundingClientRect();
            tooltip.style.top = rect.bottom + 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.opacity = '1';
        });
        
        trigger.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(tooltip)) {
                    document.body.removeChild(tooltip);
                }
            }, 300);
        });
    });
}

// Simulate real-time data updates for dashboard statistics
function updateStatistics() {
    // Randomly update stats to simulate real-time changes
    const stats = document.querySelectorAll('.stat-info p');
    
    stats.forEach((stat, index) => {
        const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
        let newValue;
        
        // Different update logic based on the type of stat
        switch(index) {
            case 0: // New Applications
                newValue = currentValue + Math.floor(Math.random() * 3);
                break;
            case 1: // Approved Loans
                newValue = currentValue + Math.floor(Math.random() * 2);
                break;
            case 2: // Pending Reviews
                const change = Math.random() > 0.5 ? 1 : -1;
                newValue = Math.max(0, currentValue + change);
                break;
            case 3: // Total Loan Value
                newValue = currentValue + Math.floor(Math.random() * 5000);
                break;
            default:
                newValue = currentValue;
        }
        
        // Format number with commas
        stat.textContent = index === 3 ? 
            '$' + newValue.toLocaleString() : 
            newValue.toLocaleString();
            
        // Add animation class for visual feedback
        stat.classList.add('updated');
        setTimeout(() => {
            stat.classList.remove('updated');
        }, 1000);
    });
}

// Handle application actions (view, approve, reject)
function handleApplicationAction(event) {
    const button = event.currentTarget;
    const action = button.getAttribute('data-action');
    const applicationId = button.closest('.application-item').getAttribute('data-id');
    
    // Handle different actions
    switch(action) {
        case 'view':
            viewApplication(applicationId);
            break;
        case 'approve':
            approveApplication(applicationId, button);
            break;
        case 'reject':
            rejectApplication(applicationId, button);
            break;
    }
}

// View application details
function viewApplication(id) {
    // In a real application, this would open a modal or navigate to details page
    console.log(`Viewing application ${id}`);
    
    // Simulate API call to get application details
    fetch(`/api/applications/${id}`)
        .then(response => response.json())
        .then(data => {
            // Show application details in a modal
            showApplicationModal(data);
        })
        .catch(error => {
            // For demo purposes, show mock data
            showApplicationModal({
                id: id,
                name: "John Smith",
                location: "Karnataka, India",
                farmSize: "12 acres",
                cropTypes: ["Rice", "Wheat"],
                requestedAmount: "$5,000",
                purpose: "Equipment Purchase",
                status: "Pending",
                submittedDate: "2023-10-15"
            });
        });
}

// Show application details in a modal
function showApplicationModal(data) {
    // Create modal element
    const modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Create modal content
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Application Details</h2>
                <button class="close-modal"><span class="material-icons">close</span></button>
            </div>
            <div class="modal-body">
                <div class="application-detail">
                    <h3>${data.name}</h3>
                    <p><span class="material-icons">location_on</span> ${data.location}</p>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="label">Farm Size:</span>
                            <span class="value">${data.farmSize}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Crops:</span>
                            <span class="value">${data.cropTypes.join(', ')}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Requested Amount:</span>
                            <span class="value">${data.requestedAmount}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Purpose:</span>
                            <span class="value">${data.purpose}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Status:</span>
                            <span class="value status-${data.status.toLowerCase()}">${data.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="label">Submitted:</span>
                            <span class="value">${data.submittedDate}</span>
                        </div>
                    </div>
                </div>
                <div class="application-action-buttons">
                    <button class="evaluate-button">Evaluate Credit</button>
                    <div class="approval-actions">
                        <button class="approve-button" data-id="${data.id}">Approve</button>
                        <button class="reject-button" data-id="${data.id}">Reject</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Add event listener to close button
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.classList.add('closing');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Add event listeners to action buttons
    modal.querySelector('.evaluate-button').addEventListener('click', () => {
        window.location.href = `evaluate-farmer.html?id=${data.id}`;
    });
    
    if (modal.querySelector('.approve-button')) {
        modal.querySelector('.approve-button').addEventListener('click', () => {
            approveApplication(data.id);
            modal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    }
    
    if (modal.querySelector('.reject-button')) {
        modal.querySelector('.reject-button').addEventListener('click', () => {
            rejectApplication(data.id);
            modal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
    }
    
    // Animation to show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Approve application
function approveApplication(id, buttonElement) {
    console.log(`Approving application ${id}`);
    
    // In a real app, this would make an API call
    // For demo, we'll just update the UI
    
    // Find application element if button is provided
    if (buttonElement) {
        const applicationItem = buttonElement.closest('.application-item');
        const statusElement = applicationItem.querySelector('.application-status');
        
        // Update status
        statusElement.classList.remove('pending', 'rejected');
        statusElement.classList.add('approved');
        statusElement.textContent = 'Approved';
        
        // Update statistics
        const approvedLoansElement = document.querySelector('.stats-container .stat-card:nth-child(2) .stat-info p');
        const pendingReviewsElement = document.querySelector('.stats-container .stat-card:nth-child(3) .stat-info p');
        
        if (approvedLoansElement && pendingReviewsElement) {
            const approvedLoans = parseInt(approvedLoansElement.textContent.replace(/,/g, ''));
            const pendingReviews = parseInt(pendingReviewsElement.textContent.replace(/,/g, ''));
            
            approvedLoansElement.textContent = (approvedLoans + 1).toLocaleString();
            pendingReviewsElement.textContent = Math.max(0, pendingReviews - 1).toLocaleString();
            
            // Add animation class for visual feedback
            approvedLoansElement.classList.add('updated');
            pendingReviewsElement.classList.add('updated');
            
            setTimeout(() => {
                approvedLoansElement.classList.remove('updated');
                pendingReviewsElement.classList.remove('updated');
            }, 1000);
        }
    }
    
    // Show notification
    showNotification('Application approved successfully', 'success');
}

// Reject application
function rejectApplication(id, buttonElement) {
    console.log(`Rejecting application ${id}`);
    
    // In a real app, this would make an API call
    // For demo, we'll just update the UI
    
    // Find application element if button is provided
    if (buttonElement) {
        const applicationItem = buttonElement.closest('.application-item');
        const statusElement = applicationItem.querySelector('.application-status');
        
        // Update status
        statusElement.classList.remove('pending', 'approved');
        statusElement.classList.add('rejected');
        statusElement.textContent = 'Rejected';
        
        // Update statistics
        const pendingReviewsElement = document.querySelector('.stats-container .stat-card:nth-child(3) .stat-info p');
        
        if (pendingReviewsElement) {
            const pendingReviews = parseInt(pendingReviewsElement.textContent.replace(/,/g, ''));
            pendingReviewsElement.textContent = Math.max(0, pendingReviews - 1).toLocaleString();
            
            // Add animation class for visual feedback
            pendingReviewsElement.classList.add('updated');
            
            setTimeout(() => {
                pendingReviewsElement.classList.remove('updated');
            }, 1000);
        }
    }
    
    // Show notification
    showNotification('Application rejected', 'error');
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const applicationItems = document.querySelectorAll('.applications-list .application-item');
            
            applicationItems.forEach(item => {
                const farmerName = item.querySelector('.farmer-details h4').textContent.toLowerCase();
                const farmerLocation = item.querySelector('.farmer-details p').textContent.toLowerCase();
                
                // Show/hide based on search term
                if (farmerName.includes(searchTerm) || farmerLocation.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Initialize notifications
function initializeNotifications() {
    const notificationBell = document.querySelector('.notification');
    
    if (notificationBell) {
        notificationBell.addEventListener('click', () => {
            toggleNotificationPanel();
        });
    }
}

// Toggle notification panel
function toggleNotificationPanel() {
    let panel = document.querySelector('.notification-panel');
    
    if (panel) {
        // Toggle existing panel
        if (panel.classList.contains('show')) {
            panel.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(panel);
            }, 300);
        } else {
            panel.classList.add('show');
        }
    } else {
        // Create new panel
        panel = document.createElement('div');
        panel.classList.add('notification-panel');
        
        // Add notification items
        panel.innerHTML = `
            <div class="notification-header">
                <h3>Notifications</h3>
                <button class="mark-all-read">Mark all as read</button>
            </div>
            <div class="notification-list">
                <div class="notification-item unread">
                    <span class="material-icons">person</span>
                    <div class="notification-content">
                        <p>New application from <strong>Raj Patel</strong></p>
                        <span class="notification-time">5 minutes ago</span>
                    </div>
                </div>
                <div class="notification-item unread">
                    <span class="material-icons">warning</span>
                    <div class="notification-content">
                        <p>Weather alert: <strong>Drought conditions</strong> in Karnataka region</p>
                        <span class="notification-time">1 hour ago</span>
                    </div>
                </div>
                <div class="notification-item">
                    <span class="material-icons">assignment_turned_in</span>
                    <div class="notification-content">
                        <p>Loan payment received from <strong>Anita Singh</strong></p>
                        <span class="notification-time">Yesterday</span>
                    </div>
                </div>
            </div>
            <div class="notification-footer">
                <a href="notifications.html">View all notifications</a>
            </div>
        `;
        
        // Position the panel
        const bellRect = document.querySelector('.notification').getBoundingClientRect();
        panel.style.top = (bellRect.bottom + 10) + 'px';
        panel.style.right = (window.innerWidth - bellRect.right) + 'px';
        
        // Add to document
        document.body.appendChild(panel);
        
        // Add event listeners
        panel.querySelector('.mark-all-read').addEventListener('click', () => {
            const unreadItems = panel.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update badge count
            const badge = document.querySelector('.badge');
            if (badge) {
                badge.textContent = '0';
                badge.style.display = 'none';
            }
        });
        
        // Show with animation
        setTimeout(() => {
            panel.classList.add('show');
        }, 10);
        
        // Close when clicking outside
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target) && !document.querySelector('.notification').contains(e.target)) {
                panel.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(panel)) {
                        document.body.removeChild(panel);
                    }
                }, 300);
                document.removeEventListener('click', closePanel);
            }
        });
    }
}

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification-toast', type);
    
    notification.innerHTML = `
        <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
        <p>${message}</p>
        <button class="close-notification"><span class="material-icons">close</span></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Add event listener to close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

// Add some additional CSS for the new elements we created via JS
(function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .tooltip {
            position: fixed;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            transition: opacity 0.3s;
            opacity: 0;
        }
        
        .notification-panel {
            position: fixed;
            width: 320px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            z-index: 100;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification-panel.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .notification-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .notification-header h3 {
            font-size: 16px;
            margin: 0;
        }
        
        .mark-all-read {
            background: none;
            border: none;
            color: var(--deep-blue);
            font-size: 12px;
            cursor: pointer;
        }
        
        .notification-list {
            max-height: 320px;
            overflow-y: auto;
        }
        
        .notification-item {
            display: flex;
            padding: 12px 15px;
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: background-color 0.3s;
            gap: 10px;
        }
        
        .notification-item:hover {
            background-color: #f9f9f9;
        }
        
        .notification-item.unread {
            background-color: rgba(25, 118, 210, 0.05);
        }
        
        .notification-item.unread::before {
            content: '';
            display: block;
            width: 8px;
            height: 8px;
            background-color: var(--deep-blue);
            border-radius: 50%;
            position: absolute;
            left: 8px;
        }
        
        .notification-item .material-icons {
            color: #777;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-content p {
            margin: 0 0 5px;
            font-size: 13px;
        }
        
        .notification-time {
            font-size: 11px;
            color: #999;
        }
        
        .notification-footer {
            padding: 10px 15px;
            text-align: center;
            border-top: 1px solid #eee;
        }
        
        .notification-footer a {
            color: var(--deep-blue);
            font-size: 12px;
            text-decoration: none;
        }
        
        .notification-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            background-color: white;
            padding: 12px 15px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .notification-toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-toast.success .material-icons {
            color: var(--primary-green);
        }
        
        .notification-toast.error .material-icons {
            color: var(--red);
        }
        
        .notification-toast.info .material-icons {
            color: var(--deep-blue);
        }
        
        .notification-toast p {
            margin: 0;
            font-size: 14px;
        }
        
        .close-notification {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            color: #999;
            margin-left: 10px;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s;
        }
        
        .modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal.closing {
            opacity: 0;
        }
        
        .modal-content {
            background-color: white;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s;
        }
        
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
            font-size: 18px;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            cursor: pointer;
            color: #777;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .application-detail h3 {
            font-size: 24px;
            margin: 0 0 10px;
        }
        
        .application-detail p {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #777;
            margin-bottom: 20px;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-item .label {
            font-size: 12px;
            color: #777;
            margin-bottom: 5px;
        }
        
        .detail-item .value {
            font-size: 16px;
            font-weight: 500;
        }
        
        .value.status-approved {
            color: var(--primary-green);
        }
        
        .value.status-pending {
            color: var(--orange);
        }
        
        .value.status-rejected {
            color: var(--red);
        }
        
        .application-action-buttons {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .evaluate-button {
            background-color: var(--deep-blue);
            color: white;
            border: none;
            border-radius: 30px;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }
        
        .evaluate-button:hover {
            background-color: #1565C0;
            transform: translateY(-2px);
        }
        
        .approval-actions {
            display: flex;
            gap: 10px;
        }
        
        .approve-button, .reject-button {
            flex: 1;
            border: none;
            border-radius: 30px;
            padding: 10px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .approve-button {
            background-color: rgba(76, 175, 80, 0.1);
            color: var(--primary-green);
        }
        
        .approve-button:hover {
            background-color: rgba(76, 175, 80, 0.2);
        }
        
        .reject-button {
            background-color: rgba(244, 67, 54, 0.1);
            color: var(--red);
        }
        
        .reject-button:hover {
            background-color: rgba(244, 67, 54, 0.2);
        }
        
        .updated {
            animation: highlight 1s ease;
        }
        
        @keyframes highlight {
            0% { background-color: rgba(76, 175, 80, 0.2); }
            100% { background-color: transparent; }
        }
        
        @media (max-width: 576px) {
            .detail-grid {
                grid-template-columns: 1fr;
            }
            
            .approval-actions {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(style);
})(); 