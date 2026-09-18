// Main JavaScript File
// Initializes all functionality when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize scroll trigger
    initScrollTrigger();
    
    // Initialize navigation
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    // Initialize animations
    if (typeof initAnimations === 'function') {
        initAnimations();
    }
    
    // Initialize cursor
    if (typeof initCursor === 'function') {
        initCursor();
    }
    
    // Initialize page transitions
    if (typeof initPageTransitions === 'function') {
        initPageTransitions();
    }
    
    // Initialize contact form
    if (typeof initContactForm === 'function') {
        initContactForm();
    }
    
    // Initialize template filters
    if (typeof initTemplateFilters === 'function') {
        initTemplateFilters();
    }
    
    // Initialize work filters
    initWorkFilters();
});

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    const timeline = gsap.timeline({
        onComplete: () => {
            loadingScreen.style.display = 'none';
        }
    });
    
    // Animate loading sequence
    timeline
        .to('.loading-letter', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        })
        .to('.loading-letter', {
            opacity: 0,
            duration: 0.3,
            delay: 0.2
        })
        .to('.loading-brand', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.1')
        .to('.loading-tagline', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2')
        .to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.inOut'
        });
}

// Initialize GSAP ScrollTrigger
function initScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Refresh ScrollTrigger on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });
}

// Work Filters (if on work page)
function initWorkFilters() {
    const filterBtns = document.querySelectorAll('.work-filters .filter-btn');
    const projectCards = document.querySelectorAll('.project-card-large');
    const noResults = document.querySelector('.projects-section .no-results');
    
    if (!filterBtns.length || !projectCards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            let visibleCount = 0;
            
            projectCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    visibleCount++;
                    
                    // Animate in
                    gsap.fromTo(card, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(card, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
            
            // Show/hide no results message
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll to element
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll position
function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop;
}

// Detect touch device
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

// Prevent scroll
function preventScroll() {
    document.body.style.overflow = 'hidden';
}

// Allow scroll
function allowScroll() {
    document.body.style.overflow = '';
}

// Check reduced motion preference
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Export utility functions for use in other scripts
window.havenUtils = {
    debounce,
    throttle,
    scrollToElement,
    isInViewport,
    getScrollPosition,
    isTouchDevice,
    preventScroll,
    allowScroll,
    prefersReducedMotion
};
