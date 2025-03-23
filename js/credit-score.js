document.addEventListener('DOMContentLoaded', function() {
    // Form steps navigation
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const form = document.getElementById('creditScoreForm');
    const modal = document.getElementById('scoreModal');
    const closeBtn = document.querySelector('.close-btn');
    
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
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
            // Add any extra fields required by your API (for example, current_score, district, crop_type, month)
            jsonData.current_score = 500; // Or derive from your app state
            // You can choose one of the location inputs to pass as district if needed
            jsonData.district = document.getElementById('location').value;
            jsonData.crop_type = document.getElementById('primaryCrop').value;
            jsonData.month = new Date().getMonth() + 1; // Current month

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
                if (data.new_credit_score) {
                    // Store score data for modal display
                    const creditScore = Math.round(data.new_credit_score);
                    
                    // Update global variables for animation
                    window.targetScore = creditScore;
                    window.recommendation = data.recommendation;
                    
                    // Show the modal with animation
                    showModal();
                    
                    // Show success message
                    window.showApiMessage("Credit score calculated successfully!", "success");
                } else {
                    console.error("No credit score in response:", data);
                    window.showApiMessage("Error calculating credit score. Using mock data instead.", "error");
                    useMockData();
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                window.showApiMessage("API unavailable. Using mock data instead.", "error");
                useMockData();
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
        
        // Animate score number
        const scoreNumber = document.querySelector('.score-number');
        const targetScore = window.targetScore;
        let currentScore = 0;
        
        const scoreAnimation = setInterval(() => {
            if (currentScore >= targetScore) {
                clearInterval(scoreAnimation);
                return;
            }
            
            currentScore += 10;
            if (currentScore > targetScore) currentScore = targetScore;
            
            scoreNumber.textContent = currentScore;
        }, 30);
        
        // Animate factor bars
        document.querySelectorAll('.factor-fill').forEach(bar => {
            const width = bar.style.width;
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