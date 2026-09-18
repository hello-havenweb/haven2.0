// Main JavaScript File
// Initializes all functionality when DOM is loaded

// Set flag for no-js fallback
document.documentElement.classList.remove('no-js');

// Loading screen timeout fallback - always remove after 3 seconds
const loadingTimeout = setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';
    }
    document.body.classList.add('gsap-loaded');
}, 3000);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize scroll trigger
    initScrollTrigger();
    
    // Initialize navigation
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    
    // Initialize animations only if GSAP is loaded
    if (typeof gsap !== 'undefined') {
        document.body.classList.add('gsap-loaded');
        if (typeof initAnimations === 'function') {
            initAnimations();
        }
    } else {
        console.warn('GSAP not loaded - animations disabled');
        // Ensure content is visible
        document.body.classList.remove('gsap-loaded');
    }
    
    // Initialize cursor (desktop only)
    if (typeof initCursor === 'function' && !isTouchDevice()) {
        initCursor();
    }
    
    // Initialize page transitions (not on mobile for better performance)
    if (typeof initPageTransitions === 'function' && window.innerWidth > 768) {
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
    
    // Ensure loading screen is hidden after initialization
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 100);
});

// Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        // Fallback - just hide the loading screen
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none';
        }, 500);
        return;
    }
    
    const timeline = gsap.timeline({
        onComplete: () => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
            clearTimeout(loadingTimeout);
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
    
    // Disable on mobile for better performance
    if (window.innerWidth <= 768) {
        ScrollTrigger.config({
            limitCallbacks: true,
            ignoreMobileResize: true
        });
    }
    
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
                    
                    // Animate in if GSAP available
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card, 
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.display = 'none';
                    }
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
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

// Allow scroll
function allowScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
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

// Error handling - ensure site is visible even if JS errors occur
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Remove loading screen on error
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';
    }
    
    // Ensure content is visible
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
});

// Fallback for browsers without GSAP
if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}
