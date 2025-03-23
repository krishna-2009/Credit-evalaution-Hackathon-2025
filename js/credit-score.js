document.addEventListener('DOMContentLoaded', function() {
    // Form steps navigation
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const form = document.getElementById('creditScoreForm');
    const modal = document.getElementById('scoreModal');
    const closeBtn = document.querySelector('.close-btn');
    
    // Toast notification function
    const showApiMessage = function(message, type = 'error') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="material-icons">${type === 'error' ? 'error' : 'check_circle'}</span>
                <span class="message">${message}</span>
            </div>
            <span class="material-icons close">close</span>
        `;
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }, 100);
        
        // Add close button functionality
        toast.querySelector('.close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    };
    
    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Validate current step fields
            if (validateStep(currentStep)) {
                // Hide current step
                currentStep.classList.remove('active');
                
                // Show next step
                const nextStep = document.querySelector(`.form-step[data-step="${currentStepNum + 1}"]`);
                nextStep.classList.add('active');
                
                // Update progress indicator
                updateProgress(currentStepNum + 1);
            }
        });
    });
    
    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            // Hide current step
            currentStep.classList.remove('active');
            
            // Show previous step
            const prevStep = document.querySelector(`.form-step[data-step="${currentStepNum - 1}"]`);
            prevStep.classList.add('active');
            
            // Update progress indicator
            updateProgress(currentStepNum - 1);
        });
    });
    
    // Update progress steps
    function updateProgress(stepNum) {
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.dataset.step);
            
            if (stepNumber === stepNum) {
                step.classList.add('active');
            } else if (stepNumber < stepNum) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Validate form step
    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                
                // Add error class to input
                input.classList.add('error');
                
                // Add error message
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                
                // Remove any existing error message
                const existingError = input.parentElement.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
                
                input.parentElement.appendChild(errorMsg);
                
                // Remove error when input is changed
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                    const error = this.parentElement.querySelector('.error-message');
                    if (error) {
                        error.remove();
                    }
                }, { once: true });
            }
        });
        
        return isValid;
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const currentStep = document.querySelector('.form-step.active');
        
        if (validateStep(currentStep)) {
            // Show loading state
            const submitBtn = document.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Calculating...';
            
            // Collect form data and add additional fields for the API if needed
            const formData = new FormData(form);
            const jsonData = {};

            // Process form data and handle special cases
            formData.forEach((value, key) => {
                // For checkbox groups, we need to collect all values
                if (key === 'climateIssues' || key === 'techniques') {
                    if (!jsonData[key]) {
                        jsonData[key] = [];
                    }
                    jsonData[key].push(value);
                } else {
                    jsonData[key] = value;
                }
            });

            // Add required fields for the API
            jsonData.current_score = 500; // Base score
            jsonData.district = document.getElementById('location').value;
            jsonData.crop_type = document.getElementById('primaryCrop').value;
            jsonData.month = new Date().getMonth() + 1; // Current month (1-12)

            console.log("Sending data to API:", jsonData);
            
            // Call the API endpoint
            fetch('http://localhost:8000/api/creditScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log("API response:", data);
                if (data && data.new_credit_score) {
                    // Store score data for modal display
                    const creditScore = Math.round(data.new_credit_score);
                    
                    // Update global variables for animation
                    window.targetScore = creditScore;
                    window.recommendation = data.recommendation || "";
                    
                    console.log("Setting target score to:", window.targetScore);
                    console.log("Setting recommendation to:", window.recommendation);
                    
                    // Show the modal with animation
                    showModal();
                    
                    // Show success message
                    showApiMessage("Credit score calculated successfully!", "success");
                } else {
                    console.error("No credit score in response:", data);
                    showApiMessage("Error calculating credit score. Please check the API response.", "error");
                    
                    // Set fallback values
                    window.targetScore = 700;
                    window.recommendation = "No recommendation available from API. Please try again later.";
                    showModal();
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                showApiMessage("API unavailable. Using fallback data.", "error");
                
                // Set fallback values
                window.targetScore = 700;
                window.recommendation = "API unavailable. Please try again later.";
                showModal();
                
                // Reset button state early to allow retrying
                submitBtn.disabled = false;
                submitBtn.textContent = 'Get Credit Score';
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Get Credit Score';
            });
        }
    });

    // Helper functions to update UI based on credit score
    function getScoreLabel(score) {
        if (score >= 750) return "Excellent";
        if (score >= 650) return "Good";
        if (score >= 550) return "Fair";
        return "Poor";
    }
    
    // Show modal
    function showModal() {
        modal.style.display = 'flex';
        
        // Get the target score
        const scoreNumber = document.querySelector('.score-number');
        const targetScore = window.targetScore || 700;
        
        console.log("In showModal, target score is:", targetScore);
        
        // Set score label
        const scoreLabel = getScoreLabel(targetScore);
        const scoreLabelElement = document.querySelector('.score-label');
        if (scoreLabelElement) {
            scoreLabelElement.textContent = scoreLabel;
        }
        
        // Set score description
        const scoreDescription = document.querySelector('.score-description');
        if (scoreDescription) {
            scoreDescription.textContent = `Based on your farm data, you have ${scoreLabel.toLowerCase()} creditworthiness!`;
        }
        
        // Display recommendation if available
        if (window.recommendation) {
            console.log("Showing recommendation:", window.recommendation);
            const recommendationContainer = document.querySelector('.recommendation-container');
            const recommendationText = document.querySelector('.recommendation-text');
            
            if (recommendationContainer && recommendationText) {
                recommendationText.textContent = window.recommendation;
                recommendationContainer.style.display = 'block';
            }
        }
        
        // Animate score counter
        let currentScore = 0;
        const scoreAnimation = setInterval(() => {
            if (currentScore >= targetScore) {
                clearInterval(scoreAnimation);
                return;
            }
            
            // Increment by appropriate amount based on score
            const increment = Math.max(5, Math.floor(targetScore / 100));
            currentScore += increment;
            if (currentScore > targetScore) currentScore = targetScore;
            
            if (scoreNumber) {
                scoreNumber.textContent = currentScore;
            }
        }, 30);
        
        // Animate factor bars
        document.querySelectorAll('.factor-fill').forEach(bar => {
            const width = bar.dataset.width || bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.5s ease-out';
                bar.style.width = width;
            }, 500);
        });
    }
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Download report button
    document.querySelector('.download-btn').addEventListener('click', function() {
        alert('Your credit report is being prepared for download.');
    });

    // Function to use mock data if API is unavailable
    function useMockData() {
        // Create mock credit score and recommendation
        const cropType = document.getElementById('primaryCrop').value || "Wheat";
        const mockScore = Math.floor(Math.random() * (850 - 550) + 550);
        
        // Generate recommendation based on score
        let mockRecommendation = "";
        if (mockScore >= 750) {
            mockRecommendation = `✅ Congratulations! You qualify for premium low-interest loans. Consider an expansion loan to grow more ${cropType} or invest in modern equipment.`;
        } else if (mockScore >= 650) {
            mockRecommendation = `🔧 You qualify for standard crop loans. Focus on maximizing yield for ${cropType}, and upgrading your irrigation systems could improve productivity.`;
        } else if (mockScore >= 550) {
            mockRecommendation = `⚡ You qualify for basic loans. Consider a crop loan to stabilize your ${cropType} output and improve your credit score over time.`;
        } else {
            mockRecommendation = `🚨 Emergency loan suggested. Your credit score is low — focus on essential inputs for ${cropType} to ensure minimum yield this season.`;
        }
        
        // Set global variables for the modal
        window.targetScore = mockScore;
        window.recommendation = mockRecommendation;
        
        // Show the modal with mock data
        showModal();
    }
}); 