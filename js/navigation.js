// Navigation Functionality

function initNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (!nav) return;
    
    // Scroll behavior for navigation
    let lastScroll = 0;
    
    const handleScroll = () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    };
    
    // Throttle scroll event
    window.addEventListener('scroll', window.havenUtils.throttle(handleScroll, 100));
    
    // Mobile menu toggle
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            if (isActive) {
                window.havenUtils.preventScroll();
            } else {
                window.havenUtils.allowScroll();
            }
        });
        
        // Close mobile menu when link is clicked
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                window.havenUtils.allowScroll();
            });
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                window.havenUtils.allowScroll();
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', window.havenUtils.debounce(() => {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navToggle.classList.remove('active');
                window.havenUtils.allowScroll();
            }
        }, 250));
    }
    
    // Set active nav link based on current page
    setActiveNavLink();
}

// Set active navigation link
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        
        if (currentPath === linkPath || 
            (currentPath === '/' && linkPath.includes('index.html')) ||
            (currentPath.includes('index.html') && linkPath === '/')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.getElementById('nav')?.offsetHeight || 80;
            window.havenUtils.scrollToElement(target, navHeight + 20);
        }
    });
});
