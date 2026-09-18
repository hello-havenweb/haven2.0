// Animation Functions using GSAP

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded - animations disabled');
        return;
    }
    
    // Check for reduced motion preference
    if (window.havenUtils && window.havenUtils.prefersReducedMotion()) {
        // Disable complex animations
        disableAnimations();
        return;
    }
    
    // Initialize reveal animations
    initRevealAnimations();
    
    // Initialize stagger animations
    initStaggerAnimations();
    
    // Initialize parallax effects (desktop only)
    if (window.innerWidth > 768) {
        initParallaxEffects();
    }
    
    // Initialize image reveals
    initImageReveals();
    
    // Initialize hero animations
    initHeroAnimations();
    
    // Initialize page header animations
    initPageHeaderAnimations();
}

// Disable animations for reduced motion
function disableAnimations() {
    // Show all elements immediately
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Remove image reveal overlays
    const imageReveals = document.querySelectorAll('.image-reveal');
    imageReveals.forEach(reveal => {
        if (reveal) {
            const style = document.createElement('style');
            style.textContent = '.image-reveal::after { display: none !important; }';
            document.head.appendChild(style);
        }
    });
}

// Reveal animations on scroll
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    revealElements.forEach(element => {
        // Skip if not supported
        if (!gsap || !ScrollTrigger) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        gsap.fromTo(element,
            {
                opacity: 0,
                y: 60
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
                    // Prevent animations from breaking on mobile
                    onEnter: () => element.classList.add('revealed')
                }
            }
        );
    });
}

// Stagger animations
function initStaggerAnimations() {
    // Find parent elements that contain staggered children
    const staggerContainers = document.querySelectorAll('.services-list, .process-list, .work-process, .beliefs-grid, .features-grid, .about-intro-content, .split-text, .template-info-features, .contact-process, .contact-info-grid, .faq-grid, .services-grid');
    
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('[data-stagger]');
        
        if (children.length === 0) return;
        
        // Fallback for no GSAP
        if (!gsap || !ScrollTrigger) {
            children.forEach(child => {
                child.style.opacity = '1';
                child.style.transform = 'none';
            });
            return;
        }
        
        gsap.fromTo(children,
            {
                opacity: 0,
                y: 40
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    once: true
                }
            }
        );
    });
}

// Parallax effects (desktop only)
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        if (!gsap || !ScrollTrigger) return;
        
        gsap.to(element, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: element.closest('.project-image, .about-intro-image, .about-image'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

// Image reveal animations
function initImageReveals() {
    const imageReveals = document.querySelectorAll('.image-reveal');
    
    imageReveals.forEach(reveal => {
        if (!gsap || !ScrollTrigger) {
            // Fallback - just show the image
            const style = document.createElement('style');
            style.textContent = '.image-reveal::after { display: none; }';
            document.head.appendChild(style);
            return;
        }
        
        gsap.to(reveal, {
            clipPath: 'inset(0 0 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: reveal,
                start: 'top 75%',
                toggleActions: 'play none none none',
                once: true
            }
        });
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Fallback if GSAP not available
    if (!gsap) {
        // Ensure hero content is visible
        const heroElements = heroSection.querySelectorAll('.hero-eyebrow, .hero-title-line, .hero-text, .hero-buttons, .hero-scroll');
        heroElements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        return;
    }
    
    const timeline = gsap.timeline({ 
        delay: 1.5,
        onStart: () => {
            // Ensure elements are visible when animation starts
            document.body.classList.add('hero-animating');
        }
    });
    
    // Animate hero eyebrow
    const eyebrow = heroSection.querySelector('.hero-eyebrow');
    if (eyebrow) {
        timeline.fromTo(eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
    }
    
    // Animate hero title lines
    const titleLines = heroSection.querySelectorAll('.hero-title-line');
    if (titleLines.length > 0) {
        timeline.fromTo(titleLines,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
            '-=0.3'
        );
    }
    
    // Animate hero text
    const heroText = heroSection.querySelector('.hero-text');
    if (heroText) {
        timeline.fromTo(heroText,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
        );
    }
    
    // Animate hero buttons
    const heroButtons = heroSection.querySelector('.hero-buttons');
    if (heroButtons) {
        timeline.fromTo(heroButtons,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );
    }
    
    // Animate hero scroll indicator
    const heroScroll = heroSection.querySelector('.hero-scroll');
    if (heroScroll) {
        timeline.fromTo(heroScroll,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
        );
    }
}

// Page header animations
function initPageHeaderAnimations() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero || document.querySelector('.hero')) return;
    
    // Fallback if GSAP not available
    if (!gsap) {
        const pageElements = pageHero.querySelectorAll('.page-eyebrow, .page-title, .page-subtitle');
        pageElements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        return;
    }
    
    const timeline = gsap.timeline({ delay: 1.2 });
    
    const eyebrow = pageHero.querySelector('.page-eyebrow');
    const title = pageHero.querySelector('.page-title');
    const subtitle = pageHero.querySelector('.page-subtitle');
    
    if (eyebrow) {
        timeline.fromTo(eyebrow,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
    }
    
    if (title) {
        timeline.fromTo(title,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.3'
        );
    }
    
    if (subtitle) {
        timeline.fromTo(subtitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
        );
    }
}

// Service item hover animations
const serviceItems = document.querySelectorAll('.service-item');
serviceItems.forEach(item => {
    const arrow = item.querySelector('.service-arrow');
    
    if (!gsap || !arrow) return;
    
    item.addEventListener('mouseenter', () => {
        gsap.to(arrow, {
            x: 10,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(arrow, {
            x: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Project card image scale on hover (desktop only)
if (window.innerWidth > 768) {
    const projectCards = document.querySelectorAll('.project-card, .project-card-large');
    projectCards.forEach(card => {
        const image = card.querySelector('.image-placeholder');
        
        if (!image || !gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.05,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
    });
}

// Template card hover animations (desktop only)
if (window.innerWidth > 768) {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        const image = card.querySelector('.image-placeholder');
        
        if (!image || !gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(card, {
                y: -4,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            });
            
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Pricing card hover animations (desktop only)
if (window.innerWidth > 768) {
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        if (!gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}
