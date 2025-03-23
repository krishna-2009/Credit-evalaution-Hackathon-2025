document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const progressSteps = document.querySelectorAll('.progress-step');
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitButton = document.querySelector('.submit-btn');
    const progressIndicator = document.querySelector('.progress-indicator');
    let currentStep = 1;
    const totalSteps = progressSteps.length;

    // Add event listeners to next buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToNextStep();
            }
        });
    });

    // Add event listeners to previous buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', goToPrevStep);
    });

    // Add event listener to submit button
    if (submitButton) {
        submitButton.addEventListener('click', handleSubmit);
    }

    // Add input event listeners for validation feedback
    const requiredInputs = document.querySelectorAll('input[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });

    // Function to go to the next step
    function goToNextStep() {
        if (currentStep < totalSteps) {
            // Update current step
            updateStepStatus(currentStep, 'completed');
            currentStep++;
            updateStepStatus(currentStep, 'active');

            // Update UI
            updateFormVisibility();
            updateProgressBar();
            
            // Scroll to top of form
            document.querySelector('.evaluation-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Function to go to the previous step
    function goToPrevStep() {
        if (currentStep > 1) {
            // Update current step
            updateStepStatus(currentStep, '');
            currentStep--;
            updateStepStatus(currentStep, 'active');

            // Update UI
            updateFormVisibility();
            updateProgressBar();
            
            // Scroll to top of form
            document.querySelector('.evaluation-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Update the status of a step (active, completed, or '')
    function updateStepStatus(stepNumber, status) {
        progressSteps.forEach(step => {
            if (parseInt(step.getAttribute('data-step')) === stepNumber) {
                // Remove all statuses
                step.classList.remove('active', 'completed');
                
                // Add new status if provided
                if (status) {
                    step.classList.add(status);
                }
            }
        });
    }

    // Update which form step is visible
    function updateFormVisibility() {
        formSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Update the progress bar width
    function updateProgressBar() {
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressIndicator.style.width = `${progressPercentage}%`;
    }

    // Validate current step inputs
    function validateStep(stepNumber) {
        const currentFormStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        const requiredInputs = currentFormStep.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;
        requiredInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Validate individual input
    function validateInput(input) {
        const formGroup = input.closest('.form-group');
        let errorMessage;

        // Remove existing error messages first
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            formGroup.removeChild(existingError);
        }

        // Check if empty
        if (!input.value.trim()) {
            errorMessage = 'This field is required';
            formGroup.classList.add('error');
            
            // Create and add error message
            const errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
            
            return false;
        }
        
        // Specific validations based on input type or id
        if (input.id === 'mobileNumber' && !/^\d{10}$/.test(input.value)) {
            errorMessage = 'Please enter a valid 10 digit mobile number';
            formGroup.classList.add('error');
            
            // Create and add error message
            const errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
            
            return false;
        }
        
        if (input.id === 'aadharNumber' && input.value.length > 0 && !/^\d{12}$/.test(input.value)) {
            errorMessage = 'Please enter a valid 12 digit Aadhar number';
            formGroup.classList.add('error');
            
            // Create and add error message
            const errorElement = document.createElement('span');
            errorElement.classList.add('error-message');
            errorElement.textContent = errorMessage;
            formGroup.appendChild(errorElement);
            
            return false;
        }
        
        // If we get here, validation passed
        formGroup.classList.remove('error');
        return true;
    }

    // Handle form submission
    function handleSubmit(event) {
        event.preventDefault();
        
        if (validateStep(currentStep)) {
            // Collect form data
            const formData = {};
            const formElements = document.querySelectorAll('.evaluation-form input, .evaluation-form select, .evaluation-form textarea');
            
            formElements.forEach(element => {
                if (element.type === 'checkbox') {
                    if (element.checked) {
                        if (!formData[element.name]) {
                            formData[element.name] = [];
                        }
                        formData[element.name].push(element.value);
                    }
                } else if (element.name && element.value) {
                    formData[element.name] = element.value;
                }
            });

            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="material-icons loading-spinner">sync</span> Processing...';
            
            // Simulate API call with timeout
            setTimeout(() => {
                // Generate mock result
                const creditScore = Math.floor(Math.random() * 400) + 400; // Random score between 400-800
                showCreditEvaluationResult(creditScore, formData);
                
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = 'Evaluate Credit';
            }, 2000);
        }
    }

    // Show credit evaluation result in a modal
    function showCreditEvaluationResult(score, formData) {
        // Create modal
        const modal = document.createElement('div');
        modal.classList.add('evaluation-modal');
        
        // Determine score category and color
        let scoreCategory, scoreColor, recommendations;
        if (score >= 750) {
            scoreCategory = 'Excellent';
            scoreColor = 'var(--primary-green)';
            recommendations = 'Eligible for loans up to ₹10,00,000 with interest rates as low as 7%';
        } else if (score >= 650) {
            scoreCategory = 'Good';
            scoreColor = 'var(--deep-blue)';
            recommendations = 'Eligible for loans up to ₹5,00,000 with interest rates starting at 9%';
        } else if (score >= 550) {
            scoreCategory = 'Fair';
            scoreColor = 'var(--orange)';
            recommendations = 'Eligible for loans up to ₹2,00,000 with interest rates starting at 12%';
        } else {
            scoreCategory = 'Poor';
            scoreColor = 'var(--red)';
            recommendations = 'Limited loan eligibility up to ₹50,000 with supporting collateral';
        }
        
        // Create risk factors (this would be algorithmically determined in a real system)
        const riskFactors = [
            { factor: 'Farm Size', value: formData.farmSize ? parseFloat(formData.farmSize) * 5 : 60, max: 100 },
            { factor: 'Land Ownership', value: formData.landOwnership === 'owned' ? 90 : formData.landOwnership === 'leased' ? 60 : 40, max: 100 },
            { factor: 'Irrigation Coverage', value: formData.irrigationCoverage ? parseInt(formData.irrigationCoverage) : 45, max: 100 },
            { factor: 'Farming Method', value: formData.farmingMethod === 'modern' ? 85 : formData.farmingMethod === 'organic' ? 70 : 50, max: 100 },
            { factor: 'Weather Risk', value: 65, max: 100 }
        ];
        
        // Generate modal content
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Credit Evaluation Result</h2>
                    <button class="close-modal"><span class="material-icons">close</span></button>
                </div>
                <div class="modal-body">
                    <div class="result-content">
                        <div class="farmer-summary">
                            <h3>${formData.firstName || ''} ${formData.lastName || ''}</h3>
                            <p>${formData.state ? formData.state.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}, India</p>
                        </div>
                        
                        <div class="score-display">
                            <div class="score-circle" style="--score-color: ${scoreColor}">
                                <div class="score-value">${score}</div>
                                <div class="score-label">${scoreCategory}</div>
                            </div>
                        </div>
                        
                        <div class="recommendation-section">
                            <h4>Recommendations</h4>
                            <p>${recommendations}</p>
                        </div>
                        
                        <div class="factors-section">
                            <h4>Risk Assessment Factors</h4>
                            <div class="factors-grid">
                                ${riskFactors.map(factor => `
                                    <div class="factor-item">
                                        <div class="factor-header">
                                            <span class="factor-name">${factor.factor}</span>
                                            <span class="factor-value">${factor.value}%</span>
                                        </div>
                                        <div class="factor-bar-container">
                                            <div class="factor-bar" style="width: ${factor.value}%; background-color: ${getFactorColor(factor.value)}"></div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-actions">
                        <button class="approve-button">Approve Loan</button>
                        <button class="reject-button">Reject Application</button>
                        <button class="download-button">
                            <span class="material-icons">download</span>
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            modal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        const approveButton = modal.querySelector('.approve-button');
        approveButton.addEventListener('click', () => {
            showToast('Application approved successfully', 'success');
            modal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(modal);
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 300);
        });
        
        const rejectButton = modal.querySelector('.reject-button');
        rejectButton.addEventListener('click', () => {
            showToast('Application rejected', 'error');
            modal.classList.add('closing');
            setTimeout(() => {
                document.body.removeChild(modal);
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 300);
        });
        
        const downloadButton = modal.querySelector('.download-button');
        downloadButton.addEventListener('click', () => {
            showToast('Report downloaded successfully', 'success');
        });
        
        // Animation for score and bars
        setTimeout(() => {
            modal.classList.add('show');
            
            setTimeout(() => {
                // Animate score counting up
                const scoreElement = modal.querySelector('.score-value');
                animateCounter(scoreElement, 0, score, 1500);
                
                // Animate factor bars
                const factorBars = modal.querySelectorAll('.factor-bar');
                factorBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.transition = 'width 1s ease-out';
                        bar.style.width = width;
                    }, 100);
                });
            }, 300);
        }, 10);
    }
    
    // Helper function to animate counting up
    function animateCounter(element, start, end, duration) {
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    // Helper function to get color based on factor value
    function getFactorColor(value) {
        if (value >= 80) return 'var(--primary-green)';
        if (value >= 60) return 'var(--deep-blue)';
        if (value >= 40) return 'var(--orange)';
        return 'var(--red)';
    }
    
    // Show toast notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.classList.add('notification-toast', type);
        
        toast.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <p>${message}</p>
            <button class="close-notification"><span class="material-icons">close</span></button>
        `;
        
        // Add to document
        document.body.appendChild(toast);
        
        // Show with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 5000);
        
        // Add event listener to close button
        toast.querySelector('.close-notification').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        });
    }
    
    // Add styles for the modal and Other dynamic elements
    (function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .evaluation-modal {
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
            
            .evaluation-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .evaluation-modal.closing {
                opacity: 0;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 15px;
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            
            .evaluation-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h2 {
                font-size: 1.5rem;
                margin: 0;
                color: var(--dark-text);
            }
            
            .close-modal {
                background: none;
                border: none;
                cursor: pointer;
                color: #777;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .result-content {
                margin-bottom: 2rem;
            }
            
            .farmer-summary {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .farmer-summary h3 {
                font-size: 1.8rem;
                margin: 0 0 0.5rem;
                color: var(--dark-text);
            }
            
            .farmer-summary p {
                color: #777;
                margin: 0;
            }
            
            .score-display {
                display: flex;
                justify-content: center;
                margin-bottom: 2rem;
            }
            
            .score-circle {
                width: 180px;
                height: 180px;
                border-radius: 50%;
                background: white;
                border: 10px solid var(--score-color);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                position: relative;
                perspective: 1000px;
            }
            
            .score-value {
                font-size: 3rem;
                font-weight: 700;
                color: var(--score-color);
            }
            
            .score-label {
                font-size: 1.2rem;
                color: #777;
                margin-top: 5px;
            }
            
            .recommendation-section {
                background-color: #f8f9fa;
                border-radius: 10px;
                padding: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .recommendation-section h4 {
                margin: 0 0 1rem;
                color: var(--dark-text);
                font-size: 1.2rem;
            }
            
            .recommendation-section p {
                margin: 0;
                line-height: 1.5;
                color: #555;
            }
            
            .factors-section h4 {
                margin: 0 0 1rem;
                color: var(--dark-text);
                font-size: 1.2rem;
            }
            
            .factors-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
            }
            
            .factor-item {
                margin-bottom: 1rem;
            }
            
            .factor-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .factor-name {
                color: #555;
                font-weight: 500;
            }
            
            .factor-value {
                color: #777;
            }
            
            .factor-bar-container {
                height: 6px;
                background-color: #e9ecef;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .factor-bar {
                height: 100%;
                border-radius: 3px;
                width: 0;
            }
            
            .result-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .approve-button, .reject-button {
                grid-row: 1;
                padding: 0.8rem;
                border: none;
                border-radius: 30px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 1rem;
            }
            
            .approve-button {
                background-color: var(--primary-green);
                color: white;
                grid-column: 1;
            }
            
            .reject-button {
                background-color: #f8f9fa;
                color: var(--red);
                border: 1px solid #eee;
                grid-column: 2;
            }
            
            .download-button {
                grid-column: span 2;
                background-color: var(--deep-blue);
                color: white;
                padding: 0.8rem;
                border: none;
                border-radius: 30px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                font-size: 1rem;
            }
            
            .approve-button:hover, .download-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            }
            
            .reject-button:hover {
                background-color: #fef7f7;
            }
            
            .loading-spinner {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @media (max-width: 576px) {
                .modal-body {
                    padding: 1.5rem;
                }
                
                .result-actions {
                    grid-template-columns: 1fr;
                }
                
                .approve-button, .reject-button, .download-button {
                    grid-column: 1;
                }
                
                .approve-button {
                    grid-row: 1;
                }
                
                .reject-button {
                    grid-row: 2;
                }
                
                .download-button {
                    grid-row: 3;
                }
                
                .score-circle {
                    width: 150px;
                    height: 150px;
                }
                
                .score-value {
                    font-size: 2.5rem;
                }
                
                .factors-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    })();
}); 