document.addEventListener('DOMContentLoaded', function() {
    // Form steps navigation
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const form = document.getElementById('creditScoreForm');
    const modal = document.getElementById('scoreModal');
    const closeBtn = document.querySelector('.close-btn');

    // Enable/disable the map search button based on input
    const pinCodeInput = document.getElementById('Pin_Code');
    const mapSearchBtn = document.getElementById('mapSearchBtn');

    pinCodeInput.addEventListener('input', function() {
        if (this.value.trim() !== "") {
            mapSearchBtn.disabled = false;
        } else {
            mapSearchBtn.disabled = true;
        }
    });

    // When the map button is clicked, open Google Maps with the pin code search query
    mapSearchBtn.addEventListener('click', function() {
        const pinCode = pinCodeInput.value.trim();
        if (pinCode !== "") {
            const url = "https://www.google.com/maps/search/" + encodeURIComponent(pinCode);
            window.open(url, '_blank'); // Opens in a new tab
        }
    });
        
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
            
            // Call the API endpoint using relative URL
            fetch('/api/creditScore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 0) {
                        // Status 0 typically indicates CORS error
                        throw new Error('CORS error - API server may not be running or configured correctly');
                    }
                    // Try to get error details from the response
                    return response.json().then(errorData => {
                        console.error("Server error details:", errorData);
                        throw new Error(`Server error: ${errorData.message || errorData.error || response.statusText}`);
                    }).catch(err => {
                        // If we can't parse the error as JSON, just throw with status
                        throw new Error('Network response was not ok: ' + response.statusText);
                    });
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
                    window.factors = data.factors || null;
                    
                    console.log("Setting target score to:", window.targetScore);
                    console.log("Setting recommendation to:", window.recommendation);
                    console.log("Setting factors to:", window.factors);
                    
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
                    window.factors = null;
                    showModal();
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                
                if (error.message.includes('CORS')) {
                    // Try again without credentials as a fallback
                    console.log("Retrying without credentials...");
                    return fetch('/api/creditScore', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        // No credentials here
                        body: JSON.stringify(jsonData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            return response.json().then(errorData => {
                                console.error("Server error details:", errorData);
                                throw new Error(`Server error: ${errorData.message || errorData.error || response.statusText}`);
                            }).catch(err => {
                                throw new Error('Fallback request failed: ' + response.statusText);
                            });
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("API response from fallback:", data);
                        if (data && data.new_credit_score) {
                            window.targetScore = Math.round(data.new_credit_score);
                            window.recommendation = data.recommendation || "";
                            window.factors = data.factors || null;
                            showModal();
                            showApiMessage("Credit score calculated successfully!", "success");
                        } else {
                            throw new Error("Invalid response from fallback");
                        }
                    })
                    .catch(fallbackError => {
                        console.error("Fallback also failed:", fallbackError);
                        // Continue to the fallback data logic below
                        throw fallbackError; 
                    });
                }
                
                // Show error message from API if available
                const errorMsg = error.message.includes('Server error') ? error.message : "API unavailable. Using fallback data.";
                showApiMessage(errorMsg, "error");
                
                // Set fallback values based on form inputs
                const cropType = document.getElementById('primaryCrop').value;
                window.targetScore = 700;
                window.recommendation = `API unavailable. Please try again later. Based on typical ${cropType} farms, you might qualify for standard loans.`;
                
                // Create fallback factor values
                window.factors = {
                    location_quality: 85,
                    soil_health: 92,
                    water_availability: 78,
                    climate_resilience: 70
                };
                
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
        
        // Update factor percentages if available from API
        if (window.factors) {
            console.log("Updating factor percentages:", window.factors);
            updateFactorBars(window.factors);
        } else {
            // Use default values if no API data available
            const defaultFactors = {
                location_quality: 85,
                soil_health: 92,
                water_availability: 78,
                climate_resilience: 70
            };
            updateFactorBars(defaultFactors);
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
    }
    
    // Update factor bars based on percentages
    function updateFactorBars(factors) {
        // Map API factor keys to display names
        const factorMapping = {
            'location_quality': 'Location Quality',
            'soil_health': 'Soil Health',
            'water_availability': 'Water Availability',
            'climate_resilience': 'Climate Resilience'
        };
        
        // Get all factor bars
        const factorElements = document.querySelectorAll('.factor');
        
        // Update each factor bar if present
        factorElements.forEach(element => {
            const nameElement = element.querySelector('.factor-name');
            if (nameElement) {
                const displayName = nameElement.textContent;
                // Find matching factor in our data
                for (const [key, value] of Object.entries(factorMapping)) {
                    if (value === displayName && factors[key] !== undefined) {
                        // Update the bar width and value
                        const fillElement = element.querySelector('.factor-fill');
                        const valueElement = element.querySelector('.factor-value');
                        
                        if (fillElement) {
                            // Set data attribute for animation
                            fillElement.dataset.width = `${factors[key]}%`;
                            // Reset width to 0 for animation
                            fillElement.style.width = '0';
                        }
                        
                        if (valueElement) {
                            valueElement.textContent = `${factors[key]}%`;
                        }
                        
                        break;
                    }
                }
            }
        });
        
        // Animate all factor bars
        animateFactorBars();
    }
    
    // Animate all factor bars
    function animateFactorBars() {
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