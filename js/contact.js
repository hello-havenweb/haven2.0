// Contact Form Functionality - HAVEN Premium Digital Agency

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    // Form validation and submission
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
        emailInput.addEventListener('input', () => {
            if (emailInput.classList.contains('error')) {
                validateEmail(emailInput);
            }
        });
    }
    
    // Auto-resize textareas
    initAutoResizeTextareas();
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const isValid = validateForm(form);
    
    if (!isValid) {
        // Scroll to first error with smooth animation
        const firstError = form.querySelector('.form-group.error');
        if (firstError && window.havenUtils) {
            window.havenUtils.scrollToElement(firstError, 100);
        }
        
        // Shake animation for submit button
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton && typeof gsap !== 'undefined') {
            gsap.fromTo(submitButton,
                { x: -10 },
                { 
                    x: 10, 
                    duration: 0.1, 
                    repeat: 3, 
                    yoyo: true,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        gsap.set(submitButton, { x: 0 });
                    }
                }
            );
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
    
    // Submit form (mailto fallback for static site)
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
    
    // Validate email specifically
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
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showError(formGroup, field);
        return false;
    }
    
    // Check checkbox
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

// Show error state with animation
function showError(formGroup, field) {
    formGroup.classList.add('error');
    field.classList.add('error');
    
    // Animate error message
    const errorMsg = formGroup.querySelector('.form-error');
    if (errorMsg && typeof gsap !== 'undefined') {
        gsap.fromTo(errorMsg,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
    }
}

// Hide error state
function hideError(formGroup, field) {
    formGroup.classList.remove('error');
    field.classList.remove('error');
}

// Submit form data (mailto fallback for static site)
function submitForm(data, form, submitButton) {
    // Since this is a static site, we use mailto as a fallback
    // In production, you would integrate with:
    // - Formspree (https://formspree.io)
    // - EmailJS (https://www.emailjs.com)
    // - Custom backend API
    // - Netlify Forms
    // - Vercel Forms
    
    // Simulate processing delay
    setTimeout(() => {
        // Create mailto link with form data
        const subject = encodeURIComponent(`New Project Inquiry from ${data.fullName}`);
        const body = encodeURIComponent(createEmailBody(data));
        const mailtoLink = `mailto:hello.havenweb@gmail.com?subject=${subject}&body=${body}`;
        
        // Open mailto (this will open the user's email client)
        window.location.href = mailtoLink;
        
        // Show success message
        setTimeout(() => {
            showSuccessMessage(form, submitButton);
        }, 500);
        
    }, 1500);
}

// Create email body from form data
function createEmailBody(data) {
    let body = `NEW PROJECT INQUIRY\n\n`;
    
    body += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `CONTACT INFORMATION\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    body += `Name: ${data.fullName}\n`;
    body += `Email: ${data.email}\n`;
    
    if (data.business) {
        body += `Business/Brand: ${data.business}\n`;
    }
    
    body += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `PROJECT DETAILS\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
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
        body += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
        body += `PROJECT DESCRIPTION\n`;
        body += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        body += `${data.description}\n`;
    }
    
    body += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `TIMELINE & BUDGET\n`;
    body += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (data.timeline) {
        body += `Timeline: ${data.timeline}\n`;
    }
    
    if (data.budget) {
        body += `Budget Range: ${data.budget}\n`;
    }
    
    body += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    body += `Sent from HAVEN Contact Form\n`;
    
    return body;
}

// Show success message with animation
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
            const timeline = gsap.timeline();
            
            timeline
                .fromTo(successMessage,
                    { opacity: 0, scale: 0.9 },
                    { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
                )
                .fromTo(successMessage.querySelector('svg'),
                    { scale: 0, rotation: -180 },
                    { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' },
                    '-=0.3'
                )
                .fromTo(successMessage.querySelector('h3'),
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                    '-=0.2'
                )
                .fromTo(successMessage.querySelector('p'),
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
                    '-=0.2'
                );
        }
        
        // Scroll to success message
        setTimeout(() => {
            if (window.havenUtils) {
                window.havenUtils.scrollToElement(successMessage, 100);
            }
        }, 200);
    }
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
    }, 500);
}

// Auto-resize textareas as user types
function initAutoResizeTextareas() {
    const textareas = document.querySelectorAll('.form-textarea');
    
    textareas.forEach(textarea => {
        // Set initial height
        autoResize(textarea);
        
        // Resize on input
        textarea.addEventListener('input', () => {
            autoResize(textarea);
        });
    });
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Form integration helper for Formspree
function submitToFormspree(formData, formspreeId) {
    return fetch(`https://formspree.io/f/${formspreeId}`, {
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
        console.log('Form submitted successfully to Formspree:', data);
        return true;
    })
    .catch(error => {
        console.error('Formspree submission error:', error);
        return false;
    });
}

// Form integration helper for EmailJS
function submitToEmailJS(templateParams, serviceId, templateId) {
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS library not loaded');
        return Promise.reject('EmailJS not loaded');
    }
    
    return emailjs.send(serviceId, templateId, templateParams)
        .then(response => {
            console.log('Email sent successfully via EmailJS:', response);
            return true;
        })
        .catch(error => {
            console.error('EmailJS submission error:', error);
            return false;
        });
}

// Export functions for external use
window.contactForm = {
    validateForm,
    validateField,
    validateEmail,
    submitToFormspree,
    submitToEmailJS,
    createEmailBody
};
