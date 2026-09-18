// Main JavaScript File - HAVEN Premium Digital Agency
// Critical mobile reliability improvements + premium initialization

// Remove no-js class immediately
document.documentElement.classList.remove('no-js');

// Critical: Loading screen timeout fallback - NEVER let it block the site
const LOADING_TIMEOUT = 2500; // Maximum 2.5 seconds
let loadingComplete = false;

const forceRemoveLoading = setTimeout(() => {
    if (!loadingComplete) {
        console.warn('Loading screen timeout - forcing removal');
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none';
        }
        document.body.classList.add('gsap-loaded');
        ensureContentVisible();
    }
}, LOADING_TIMEOUT);

// Ensure content is always visible - critical mobile fix
function ensureContentVisible() {
    const criticalElements = document.querySelectorAll(
        '.hero-eyebrow, .hero-title, .hero-title-line, .hero-text, .hero-buttons, .nav, [data-reveal], [data-stagger]'
    );
    
    criticalElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
    });
}

// DOM Ready initialization
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
            try {
                initAnimations();
            } catch (error) {
                console.error('Animation initialization error:', error);
                ensureContentVisible();
            }
        }
    } else {
        console.warn('GSAP not loaded - animations disabled');
        document.body.classList.remove('gsap-loaded');
        ensureContentVisible();
    }
    
    // Initialize cursor (desktop only, not on touch devices)
    if (typeof initCursor === 'function' && !isTouchDevice() && window.innerWidth >= 1024) {
        try {
            initCursor();
        } catch (error) {
            console.error('Cursor initialization error:', error);
        }
    }
    
    // Initialize page transitions (desktop only for performance)
    if (typeof initPageTransitions === 'function' && window.innerWidth > 1024) {
        try {
            initPageTransitions();
        } catch (error) {
            console.error('Page transition initialization error:', error);
        }
    }
    
    // Initialize contact form
    if (typeof initContactForm === 'function') {
        try {
            initContactForm();
        } catch (error) {
            console.error('Contact form initialization error:', error);
        }
    }
    
    // Initialize template filters
    if (typeof initTemplateFilters === 'function') {
        try {
            initTemplateFilters();
        } catch (error) {
            console.error('Template filters initialization error:', error);
        }
    }
    
    // Initialize work filters
    initWorkFilters();
    
    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Ensure loading screen is removed after a brief delay
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
        }
    }, 100);
});

// Premium Loading Screen Animation
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) {
        loadingComplete = true;
        return;
    }
    
    // Fallback - just hide the loading screen if GSAP unavailable
    if (typeof gsap === 'undefined') {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.style.display = 'none';
            loadingComplete = true;
            ensureContentVisible();
        }, 800);
        return;
    }
    
    // Premium GSAP animation sequence
    const timeline = gsap.timeline({
        onComplete: () => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
            loadingComplete = true;
            clearTimeout(forceRemoveLoading);
        }
    });
    
    timeline
        // H letter reveal
        .to('.loading-letter', {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
        })
        // Brief hold
        .to('.loading-letter', {
            opacity: 1,
            duration: 0.2
        })
        // Fade to brand
        .to('.loading-letter', {
            opacity: 0,
            scale: 0.95,
            duration: 0.3
        })
        // HAVEN brand appears
        .to('.loading-brand', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.15')
        // Tagline appears
        .to('.loading-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        }, '-=0.2')
        // Fade out entire loading screen
        .to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'power2.inOut'
        });
}

// Initialize GSAP ScrollTrigger with mobile optimizations
function initScrollTrigger() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    try {
        gsap.registerPlugin(ScrollTrigger);
        
        // Mobile optimizations
        if (window.innerWidth <= 768) {
            ScrollTrigger.config({
                limitCallbacks: true,
                ignoreMobileResize: true,
                autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
            });
        }
        
        // Refresh ScrollTrigger on window resize (debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        });
        
    } catch (error) {
        console.error('ScrollTrigger initialization error:', error);
    }
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

// Scroll Progress Indicator
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: rgba(15, 10, 22, 0.5);
            z-index: calc(var(--z-nav) + 1);
            pointer-events: none;
        }
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #7C3AED, #A855F7);
            width: 0%;
            transition: width 0.1s ease;
            box-shadow: 0 0 12px rgba(124, 58, 237, 0.6);
        }
    `;
    document.head.appendChild(style);
    
    // Update progress on scroll
    const updateProgress = throttle(() => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = `${Math.min(progress, 100)}%`;
        }
    }, 10);
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
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
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    if (!element) return false;
    
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
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
}

// Allow scroll
function allowScroll() {
    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
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

// Global error handling - ensure site remains visible even if JS errors occur
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Remove loading screen on error
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        loadingScreen.style.display = 'none';
    }
    
    // Ensure content is visible
    ensureContentVisible();
});

// Fallback for browsers without GSAP
if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded - using fallback visibility');
    ensureContentVisible();
}

// Page visibility change - pause/resume animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden - pause heavy animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    } else {
        // Page is visible again - resume
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }
    }
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    
    const href = target.getAttribute('href');
    if (href === '#') return;
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
        e.preventDefault();
        const navHeight = document.getElementById('nav')?.offsetHeight || 80;
        scrollToElement(targetElement, navHeight + 20);
    }
});

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Connect Time: ${connectTime}ms`);
            console.log(`Render Time: ${renderTime}ms`);
        }
    });
}
