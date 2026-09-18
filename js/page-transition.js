// Page Transition Functionality - HAVEN Premium Digital Agency
// Smooth page transitions without breaking navigation

function initPageTransitions() {
    // Check for reduced motion preference
    if (window.havenUtils && window.havenUtils.prefersReducedMotion()) {
        return;
    }
    
    // Only on desktop for better performance
    if (window.innerWidth <= 1024) {
        return;
    }
    
    // Create transition overlay if it doesn't exist
    let transitionOverlay = document.querySelector('.page-transition');
    
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        document.body.appendChild(transitionOverlay);
    }
    
    // Handle internal navigation links
    const internalLinks = document.querySelectorAll('a[href^="./"], a[href^="../"], a[href^="/"], a[href^="' + window.location.origin + '"]');
    
    internalLinks.forEach(link => {
        // Skip certain links
        if (link.getAttribute('href').startsWith('#') || 
            link.getAttribute('target') === '_blank' ||
            link.hasAttribute('download') ||
            link.classList.contains('nav-logo')) {
            return;
        }
        
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's the same page
            if (isSamePage(href)) {
                return;
            }
            
            e.preventDefault();
            
            // Trigger page transition
            transitionToPage(href, transitionOverlay);
        });
    });
}

// Check if link points to the same page
function isSamePage(href) {
    if (!href) return true;
    
    const currentPath = window.location.pathname;
    const linkPath = new URL(href, window.location.origin).pathname;
    
    return currentPath === linkPath;
}

// Transition to new page
function transitionToPage(url, overlay) {
    if (typeof gsap === 'undefined') {
        // Fallback without GSAP
        window.location.href = url;
        return;
    }
    
    // Animate overlay in
    gsap.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
        onStart: () => {
            overlay.classList.add('active');
        },
        onComplete: () => {
            // Navigate to new page
            window.location.href = url;
        }
    });
}

// Fade in page on load
window.addEventListener('load', () => {
    if (window.havenUtils && window.havenUtils.prefersReducedMotion()) {
        return;
    }
    
    const transitionOverlay = document.querySelector('.page-transition');
    
    if (transitionOverlay && transitionOverlay.classList.contains('active')) {
        if (typeof gsap !== 'undefined') {
            gsap.to(transitionOverlay, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut',
                onComplete: () => {
                    transitionOverlay.classList.remove('active');
                }
            });
        } else {
            transitionOverlay.classList.remove('active');
            transitionOverlay.style.opacity = '0';
        }
    }
});

// Handle browser back/forward buttons
window.addEventListener('pageshow', (event) => {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        // Page is loaded from cache (back/forward button)
        const transitionOverlay = document.querySelector('.page-transition');
        
        if (transitionOverlay) {
            transitionOverlay.classList.remove('active');
            transitionOverlay.style.opacity = '0';
        }
        
        // Refresh ScrollTrigger instances
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
});

// Smooth entry animation for page content
function initPageEntry() {
    if (window.havenUtils && window.havenUtils.prefersReducedMotion()) {
        return;
    }
    
    if (typeof gsap === 'undefined') {
        return;
    }
    
    const pageContent = document.querySelector('main, body > section:first-of-type');
    
    if (pageContent) {
        gsap.fromTo(pageContent,
            { opacity: 0 },
            { 
                opacity: 1, 
                duration: 0.6, 
                delay: 0.2,
                ease: 'power2.out' 
            }
        );
    }
}

// Initialize page entry animation
document.addEventListener('DOMContentLoaded', initPageEntry);

// Prefetch links on hover for faster navigation
function initLinkPrefetch() {
    const internalLinks = document.querySelectorAll('a[href^="./"], a[href^="../"], a[href^="/"]');
    
    internalLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) return;
        
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            prefetchPage(href);
        }, { once: true });
    });
}

// Prefetch a page
function prefetchPage(url) {
    if (!url) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
}

// Initialize prefetching
initLinkPrefetch();

// Handle navigation errors
window.addEventListener('error', (e) => {
    const transitionOverlay = document.querySelector('.page-transition');
    
    if (transitionOverlay && transitionOverlay.classList.contains('active')) {
        // Reset transition overlay on error
        if (typeof gsap !== 'undefined') {
            gsap.to(transitionOverlay, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    transitionOverlay.classList.remove('active');
                }
            });
        } else {
            transitionOverlay.classList.remove('active');
            transitionOverlay.style.opacity = '0';
        }
    }
}, true);

// Prevent transitions during page refresh
window.addEventListener('beforeunload', () => {
    const transitionOverlay = document.querySelector('.page-transition');
    
    if (transitionOverlay) {
        transitionOverlay.style.display = 'none';
    }
});
