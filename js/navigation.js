// Navigation Functionality - HAVEN Premium Digital Agency

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (!nav) return;
    
    // Scroll behavior for navigation with smooth transitions
    let lastScroll = 0;
    const navHeight = nav.offsetHeight;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class with smooth transition
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };
    
    // Throttle scroll event for better performance
    window.addEventListener('scroll', window.havenUtils.throttle(handleScroll, 100));
    
    // Mobile menu toggle with premium animations
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            if (isActive) {
                window.havenUtils.preventScroll();
                
                // Animate mobile menu links in
                if (typeof gsap !== 'undefined') {
                    const links = mobileMenu.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');
                    gsap.fromTo(links,
                        { opacity: 0, y: 30 },
                        { 
                            opacity: 1, 
                            y: 0, 
                            duration: 0.5,
                            stagger: 0.08,
                            ease: 'power2.out',
                            delay: 0.1
                        }
                    );
                }
            } else {
                window.havenUtils.allowScroll();
                
                // Animate mobile menu links out
                if (typeof gsap !== 'undefined') {
                    const links = mobileMenu.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');
                    gsap.to(links,
                        { 
                            opacity: 0, 
                            y: 20, 
                            duration: 0.3,
                            stagger: 0.04,
                            ease: 'power2.in'
                        }
                    );
                }
            }
        });
        
        // Close mobile menu when link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', window.havenUtils.debounce(() => {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250));
        
        // Close mobile menu function
        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            navToggle.classList.remove('active');
            window.havenUtils.allowScroll();
        }
    }
    
    // Set active nav link based on current page
    setActiveNavLink();
    
    // Add subtle parallax effect to nav on scroll (desktop only)
    if (window.innerWidth > 1024 && typeof gsap !== 'undefined') {
        window.addEventListener('scroll', window.havenUtils.throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled > 0) {
                gsap.to(nav, {
                    y: scrolled * parallaxSpeed * 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        }, 100));
    }
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        // Check if current page matches link
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.includes('index.html') && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Premium nav link hover effect
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active') && typeof gsap !== 'undefined') {
                gsap.to(link, {
                    color: 'var(--accent-primary)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active') && typeof gsap !== 'undefined') {
                gsap.to(link, {
                    color: '#C1C1C1',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
});

// Smooth scroll for anchor links with offset
document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    
    const href = target.getAttribute('href');
    if (href === '#') return;
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
        e.preventDefault();
        const navHeight = document.getElementById('nav')?.offsetHeight || 80;
        
        if (window.havenUtils && window.havenUtils.scrollToElement) {
            window.havenUtils.scrollToElement(targetElement, navHeight + 20);
        } else {
            // Fallback smooth scroll
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - (navHeight + 20);
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Hide nav on scroll down, show on scroll up (optional premium feature)
let lastScrollPosition = 0;
let ticking = false;

function updateNavVisibility() {
    const currentScrollPosition = window.pageYOffset;
    const nav = document.getElementById('nav');
    
    if (!nav) return;
    
    // Only apply on mobile/tablet for cleaner experience
    if (window.innerWidth <= 1024) {
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 100) {
            // Scrolling down
            nav.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            nav.style.transform = 'translateY(0)';
        }
    }
    
    lastScrollPosition = currentScrollPosition;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking && window.innerWidth <= 1024) {
        window.requestAnimationFrame(updateNavVisibility);
        ticking = true;
    }
});
