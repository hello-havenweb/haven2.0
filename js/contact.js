// Contact Form Functionality - HAVEN Premium Digital Agency

const WEB3FORMS_ACCESS_KEY = "d5f8d110-237d-4108-856a-c81e16524eb9";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";


// ============================================================
// INITIALIZE CONTACT FORM
// ============================================================

function initContactForm() {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    // Form submission
    contactForm.addEventListener("submit", handleFormSubmit);

    // Real-time validation
    const requiredInputs = contactForm.querySelectorAll("[required]");

    requiredInputs.forEach((input) => {
        input.addEventListener("blur", () => validateField(input));

        input.addEventListener("input", () => {
            if (input.classList.contains("error")) {
                validateField(input);
            }
        });
    });

    // Email validation
    const emailInput = contactForm.querySelector("#email");

    if (emailInput) {
        emailInput.addEventListener("blur", () => {
            validateEmail(emailInput);
        });

        emailInput.addEventListener("input", () => {
            if (emailInput.classList.contains("error")) {
                validateEmail(emailInput);
            }
        });
    }

    // Auto-resize textareas
    initAutoResizeTextareas();
}


// ============================================================
// HANDLE FORM SUBMISSION
// ============================================================

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;

    // Validate form
    const isValid = validateForm(form);

    if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector(".form-group.error");

        if (firstError && window.havenUtils) {
            window.havenUtils.scrollToElement(firstError, 100);
        }

        // Shake submit button
        const submitButton = form.querySelector(
            'button[type="submit"]'
        );

        if (submitButton && typeof gsap !== "undefined") {
            gsap.fromTo(
                submitButton,
                { x: -10 },
                {
                    x: 10,
                    duration: 0.1,
                    repeat: 3,
                    yoyo: true,
                    ease: "power1.inOut",
                    onComplete: () => {
                        gsap.set(submitButton, { x: 0 });
                    }
                }
            );
        }

        return;
    }

    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    if (!submitButton) return;

    // Show loading state
    submitButton.classList.add("loading");
    submitButton.disabled = true;

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Submit to Web3Forms
    await submitForm(data, form, submitButton);
}


// ============================================================
// VALIDATE ENTIRE FORM
// ============================================================

function validateForm(form) {
    let isValid = true;

    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate email specifically
    const emailInput = form.querySelector("#email");

    if (emailInput && !validateEmail(emailInput)) {
        isValid = false;
    }

    return isValid;
}


// ============================================================
// VALIDATE INDIVIDUAL FIELD
// ============================================================

function validateField(field) {
    const formGroup = field.closest(".form-group");

    if (!formGroup) return true;

    // Checkbox validation
    if (
        field.type === "checkbox" &&
        field.hasAttribute("required") &&
        !field.checked
    ) {
        showError(formGroup, field);
        return false;
    }

    // Normal input validation
    const value = field.value.trim();

    if (field.hasAttribute("required") && !value) {
        showError(formGroup, field);
        return false;
    }

    hideError(formGroup, field);

    return true;
}


// ============================================================
// VALIDATE EMAIL
// ============================================================

function validateEmail(emailInput) {
    const formGroup = emailInput.closest(".form-group");

    if (!formGroup) return true;

    const email = emailInput.value.trim();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Invalid email
    if (email && !emailRegex.test(email)) {
        showError(formGroup, emailInput);
        return false;
    }

    // Required but empty
    if (
        emailInput.hasAttribute("required") &&
        !email
    ) {
        showError(formGroup, emailInput);
        return false;
    }

    hideError(formGroup, emailInput);

    return true;
}


// ============================================================
// SHOW FIELD ERROR
// ============================================================

function showError(formGroup, field) {
    formGroup.classList.add("error");
    field.classList.add("error");

    const errorMsg =
        formGroup.querySelector(".form-error");

    if (
        errorMsg &&
        typeof gsap !== "undefined"
    ) {
        gsap.fromTo(
            errorMsg,
            {
                opacity: 0,
                y: -10
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            }
        );
    }
}


// ============================================================
// HIDE FIELD ERROR
// ============================================================

function hideError(formGroup, field) {
    formGroup.classList.remove("error");
    field.classList.remove("error");
}


// ============================================================
// SUBMIT TO WEB3FORMS
// ============================================================

async function submitForm(
    data,
    form,
    submitButton
) {
    try {
        const formData = new FormData(form);

        // Web3Forms access key
        formData.set(
            "access_key",
            WEB3FORMS_ACCESS_KEY
        );

        // Email subject
        formData.set(
            "subject",
            `New HAVEN Project Inquiry from ${data.fullName || "Website Visitor"}`
        );

        // Sender name
        formData.set(
            "from_name",
            "HAVEN Website"
        );

        // Reply directly to visitor's email
        if (data.email) {
            formData.set(
                "replyto",
                data.email
            );
        }

        // Convert FormData to JSON
        const payload =
            Object.fromEntries(
                formData.entries()
            );

        // Send request
        const response = await fetch(
            WEB3FORMS_ENDPOINT,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body: JSON.stringify(payload)
            }
        );

        // Read response
        let result = {};

        try {
            result = await response.json();
        } catch (error) {
            throw new Error(
                "Invalid response received from the form service."
            );
        }

        // Check Web3Forms response
        if (
            !response.ok ||
            !result.success
        ) {
            throw new Error(
                result.message ||
                "Your message could not be sent. Please try again."
            );
        }

        // SUCCESS
        showSuccessMessage(
            form,
            submitButton
        );

    } catch (error) {
        console.error(
            "HAVEN contact form error:",
            error
        );

        // Restore button
        submitButton.classList.remove(
            "loading"
        );

        submitButton.disabled = false;

        // Show error
        showSubmissionError(
            form,
            error.message ||
                "Something went wrong. Please try again."
        );
    }
}


// ============================================================
// SHOW SUBMISSION ERROR
// ============================================================

function showSubmissionError(
    form,
    message
) {
    let errorMessage =
        form.querySelector(
            ".form-submit-error"
        );

    // Create error element if it doesn't exist
    if (!errorMessage) {
        errorMessage =
            document.createElement("div");

        errorMessage.className =
            "form-submit-error";

        errorMessage.setAttribute(
            "role",
            "alert"
        );

        const successMessage =
            form.querySelector(
                ".form-success"
            );

        if (successMessage) {
            successMessage.insertAdjacentElement(
                "beforebegin",
                errorMessage
            );
        } else {
            form.appendChild(
                errorMessage
            );
        }
    }

    errorMessage.textContent = message;

    errorMessage.classList.add(
        "active"
    );

    // Hide after 6 seconds
    setTimeout(() => {
        errorMessage.classList.remove(
            "active"
        );
    }, 6000);
}


// ============================================================
// CREATE EMAIL BODY
// ============================================================

function createEmailBody(data) {
    let body =
        "NEW PROJECT INQUIRY\n\n";

    body +=
        "━━━━━━━━━━━━━━━━━━━━━━\n";

    body +=
        "CONTACT INFORMATION\n";

    body +=
        "━━━━━━━━━━━━━━━━━━━━━━\n\n";

    body +=
        `Name: ${data.fullName || "Not provided"}\n`;

    body +=
        `Email: ${data.email || "Not provided"}\n`;

    if (data.business) {
        body +=
            `Business/Brand: ${data.business}\n`;
    }

    body +=
        "\n━━━━━━━━━━━━━━━━━━━━━━\n";

    body +=
        "PROJECT DETAILS\n";

    body +=
        "━━━━━━━━━━━━━━━━━━━━━━\n\n";

    if (data.template) {
        body +=
            `Template: ${data.template}\n`;
    }

    if (data.package) {
        body +=
            `Package: ${data.package}\n`;
    }

    if (data.pages) {
        body +=
            `Number of Pages: ${data.pages}\n`;
    }

    if (data.features) {
        body +=
            `\nRequired Features:\n${data.features}\n`;
    }

    if (data.domain) {
        body +=
            `\nDomain/Hosting Status: ${data.domain}\n`;
    }

    if (data.description) {
        body +=
            "\n━━━━━━━━━━━━━━━━━━━━━━\n";

        body +=
            "PROJECT DESCRIPTION\n";

        body +=
            "━━━━━━━━━━━━━━━━━━━━━━\n\n";

        body +=
            `${data.description}\n`;
    }

    body +=
        "\n━━━━━━━━━━━━━━━━━━━━━━\n";

    body +=
        "TIMELINE & BUDGET\n";

    body +=
        "━━━━━━━━━━━━━━━━━━━━━━\n\n";

    if (data.timeline) {
        body +=
            `Timeline: ${data.timeline}\n`;
    }

    if (data.budget) {
        body +=
            `Budget Range: ${data.budget}\n`;
    }

    body +=
        "\n━━━━━━━━━━━━━━━━━━━━━━\n";

    body +=
        "Sent from HAVEN Contact Form\n";

    return body;
}


// ============================================================
// SHOW SUCCESS MESSAGE
// ============================================================

function showSuccessMessage(
    form,
    submitButton
) {
    // Reset button
    submitButton.classList.remove(
        "loading"
    );

    submitButton.disabled = false;

    // Show success state
    form.classList.add("success");

    const successMessage =
        form.querySelector(
            ".form-success"
        );

    if (!successMessage) {
        form.reset();
        return;
    }

    successMessage.classList.add(
        "active"
    );

    // Animate success message
    if (typeof gsap !== "undefined") {
        const timeline =
            gsap.timeline();

        timeline
            .fromTo(
                successMessage,
                {
                    opacity: 0,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    ease: "back.out(1.4)"
                }
            )
            .fromTo(
                successMessage.querySelector(
                    "svg"
                ),
                {
                    scale: 0,
                    rotation: -180
                },
                {
                    scale: 1,
                    rotation: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                },
                "-=0.3"
            )
            .fromTo(
                successMessage.querySelector(
                    "h3"
                ),
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                },
                "-=0.2"
            )
            .fromTo(
                successMessage.querySelector(
                    "p"
                ),
                {
                    opacity: 0,
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out"
                },
                "-=0.2"
            );
    }

    // Scroll to success message
    setTimeout(() => {
        if (window.havenUtils) {
            window.havenUtils.scrollToElement(
                successMessage,
                100
            );
        }
    }, 200);

    // Reset form
    setTimeout(() => {
        form.reset();
    }, 500);
}


// ============================================================
// AUTO-RESIZE TEXTAREAS
// ============================================================

function initAutoResizeTextareas() {
    const textareas =
        document.querySelectorAll(
            ".form-textarea"
        );

    textareas.forEach((textarea) => {
        // Initial height
        autoResize(textarea);

        // Resize while typing
        textarea.addEventListener(
            "input",
            () => {
                autoResize(textarea);
            }
        );
    });
}


// ============================================================
// AUTO RESIZE
// ============================================================

function autoResize(textarea) {
    textarea.style.height = "auto";

    textarea.style.height =
        textarea.scrollHeight + "px";
}


// ============================================================
// EXPORT PUBLIC FUNCTIONS
// ============================================================

window.contactForm = {
    validateForm,
    validateField,
    validateEmail,
    submitForm,
    createEmailBody
};
