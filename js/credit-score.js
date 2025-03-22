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
            document.querySelector('.submit-btn').disabled = true;
            document.querySelector('.submit-btn').textContent = 'Calculating...';
            
            // Simulate API call
            setTimeout(() => {
                // Show the modal with credit score result
                showModal();
                
                // Reset button
                document.querySelector('.submit-btn').disabled = false;
                document.querySelector('.submit-btn').textContent = 'Get Credit Score';
            }, 2000);
        }
    });
    
    // Show modal
    function showModal() {
        modal.style.display = 'flex';
        
        // Animate score number
        const scoreNumber = document.querySelector('.score-number');
        const targetScore = 780;
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
}); 