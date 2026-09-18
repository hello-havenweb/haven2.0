// Contact Form Functionality

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form validation
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const requiredInputs = contactForm.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Email validation
    const emailInput = contactForm.querySelector('#email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => validateEmail(emailInput));
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const isValid = validateForm(form);
    
    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.form-group.error');
        if (firstError) {
            window.havenUtils.scrollToElement(firstError, 100);
        }
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission (replace with actual submission)
    submitForm(data, form, submitButton);
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate email
    const emailInput = form.querySelector('#email');
    if (emailInput && !validateEmail(emailInput)) {
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const formGroup = field.closest('.form-group');
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showError(formGroup, field);
        return false;
    }
    
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        showError(formGroup, field);
        return false;
    }
    
    hideError(formGroup, field);
    return true;
}

// Validate email format
function validateEmail(emailInput) {
    const formGroup = emailInput.closest('.form-group');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showError(formGroup, emailInput);
        return false;
    }
    
    if (emailInput.hasAttribute('required') && !email) {
        showError(formGroup, emailInput);
        return false;
    }
    
    hideError(formGroup, emailInput);
    return true;
}

// Show error state
function showError(formGroup, field) {
    formGroup.classList.add('error');
    field.classList.add('error');
}

// Hide error state
function hideError(formGroup, field) {
    formGroup.classList.remove('error');
    field.classList.remove('error');
}

// Submit form data
function submitForm(data, form, submitButton) {
    // Since this is a static site, we'll use mailto as fallback
    // In production, integrate with Formspree, EmailJS, or custom backend
    
    // Simulate API call delay
    setTimeout(() => {
        // Create mailto link with form data
        const subject = `New Project Inquiry from ${data.fullName}`;
        const body = createEmailBody(data);
        const mailtoLink = `mailto:hello.havenweb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open mailto
        window.location.href = mailtoLink;
        
        // Show success message
        showSuccessMessage(form, submitButton);
    }, 1500);
}

// Create email body from form data
function createEmailBody(data) {
    let body = `New project inquiry from ${data.fullName}\n\n`;
    
    body += `Email: ${data.email}\n`;
    
    if (data.business) {
        body += `Business/Brand: ${data.business}\n`;
    }
    
    if (data.template) {
        body += `Template: ${data.template}\n`;
    }
    
    if (data.package) {
        body += `Package: ${data.package}\n`;
    }
    
    if (data.pages) {
        body += `Number of Pages: ${data.pages}\n`;
    }
    
    if (data.features) {
        body += `\nRequired Features:\n${data.features}\n`;
    }
    
    if (data.domain) {
        body += `\nDomain/Hosting Status: ${data.domain}\n`;
    }
    
    if (data.description) {
        body += `\nProject Description:\n${data.description}\n`;
    }
    
    if (data.timeline) {
        body += `\nDesired Timeline: ${data.timeline}\n`;
    }
    
    if (data.budget) {
        body += `Budget Range: ${data.budget}\n`;
    }
    
    return body;
}

// Show success message
function showSuccessMessage(form, submitButton) {
    // Reset button state
    submitButton.classList.remove('loading');
    submitButton.disabled = false;
    
    // Show success state
    form.classList.add('success');
    const successMessage = form.querySelector('.form-success');
    
    if (successMessage) {
        successMessage.classList.add('active');
        
        // Animate success message
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(successMessage,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }
        
        // Scroll to success message
        setTimeout(() => {
            window.havenUtils.scrollToElement(successMessage, 100);
        }, 100);
    }
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
    }, 500);
}

// Character counter for textareas
function initCharacterCounter() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = textarea.getAttribute('maxlength');
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.textContent = `0 / ${maxLength}`;
        
        textarea.parentElement.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--accent-primary)';
            } else {
                counter.style.color = 'var(--text-secondary)';
            }
        });
    });
}

// Auto-resize textareas
function initAutoResizeTextareas() {
    const textareas = document.querySelectorAll('.form-textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initAutoResizeTextareas();
});

// Form integration helpers for third-party services

// Formspree integration
function submitToFormspree(formData, formspreeId) {
    fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Form submission failed');
        }
    })
    .then(data => {
        console.log('Form submitted successfully:', data);
        return true;
    })
    .catch(error => {
        console.error('Form submission error:', error);
        return false;
    });
}

// EmailJS integration
function submitToEmailJS(formData, serviceId, templateId) {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        return;
    }
    
    emailjs.send(serviceId, templateId, formData)
        .then(response => {
            console.log('Email sent successfully:', response);
            return true;
        })
        .catch(error => {
            console.error('Email sending failed:', error);
            return false;
        });
}

// Export functions for external use
window.contactForm = {
    validateForm,
    validateField,
    validateEmail,
    submitToFormspree,
    submitToEmailJS
};
