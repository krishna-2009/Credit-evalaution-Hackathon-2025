const signUpBtn = document.getElementById("sign-up-btn");
const signInBtn = document.getElementById("sign-in-btn");
const container = document.querySelector(".container");

// Switch to Sign Up form
signUpBtn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

// Switch to Sign In form
signInBtn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// Form validation
const forms = document.querySelectorAll("form");

forms.forEach(form => {
    form.addEventListener("submit", function(e) {
        // Get form elements
        const inputs = form.querySelectorAll("input[required]");
        let isValid = true;
        
        // Check each required input
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add("error");
                
                // Remove error class when user starts typing
                input.addEventListener("input", function() {
                    this.classList.remove("error");
                });
            }
        });
        
        // If form is not valid, prevent submission
        if (!isValid) {
            e.preventDefault();
        }
        
        // If it's the sign-up form
        if (form.classList.contains("sign-up-form") && isValid) {
            e.preventDefault(); // Prevent default for demo
            
            // Get user type
            const userType = form.querySelector('input[name="user-type"]:checked').value;
            
            // In a real app, we would send the form data to the server
            // For demo purposes just redirect based on user type
            if (userType === "banker") {
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "credit-score.html";
            }
        }
    });
});

// Add some animation effects
document.addEventListener("DOMContentLoaded", function() {
    // Initial fade-in animation
    container.style.opacity = "0";
    container.style.transition = "opacity 0.5s ease";
    
    setTimeout(() => {
        container.style.opacity = "1";
    }, 200);
    
    // Input field animation
    const inputFields = document.querySelectorAll(".input-field");
    
    inputFields.forEach((field, index) => {
        field.style.transform = "translateY(20px)";
        field.style.opacity = "0";
        field.style.transition = `transform 0.4s ease ${index * 0.1}s, opacity 0.4s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            field.style.transform = "translateY(0)";
            field.style.opacity = "1";
        }, 300);
    });
}); 