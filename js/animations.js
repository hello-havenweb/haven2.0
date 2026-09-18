// Animation Functions - HAVEN Premium Digital Agency
// Premium cinematic motion system with mobile reliability

function initAnimations() {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded - animations disabled');
        return;
    }
    
    // Check for reduced motion preference
    if (window.havenUtils && window.havenUtils.prefersReducedMotion()) {
        disableAnimations();
        return;
    }
    
    // Initialize animation systems
    initRevealAnimations();
    initStaggerAnimations();
    
    // Desktop-only animations
    if (window.innerWidth > 1024) {
        initParallaxEffects();
        initMagneticButtons();
    }
    
    initImageReveals();
    initHeroAnimations();
    initPageHeaderAnimations();
    initServiceItemAnimations();
    initProjectCardAnimations();
}

// Disable animations for reduced motion
function disableAnimations() {
    const elements = document.querySelectorAll('[data-reveal], [data-stagger]');
    elements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
    });
    
    // Remove image reveal overlays
    const style = document.createElement('style');
    style.textContent = '.image-reveal::after { display: none !important; }';
    document.head.appendChild(style);
}

// Premium reveal animations on scroll
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    revealElements.forEach(element => {
        if (!gsap || !ScrollTrigger) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }
        
        const animation = gsap.fromTo(element,
            {
                opacity: 0,
                y: 60,
                scale: 0.98
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true,
                    onEnter: () => {
                        element.classList.add('revealed');
                    }
                }
            }
        );
    });
}

// Stagger animations for groups
function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll(
        '.services-list, .process-list, .work-process, .beliefs-grid, .features-grid, ' +
        '.about-intro-content, .split-text, .template-info-features, .contact-process, ' +
        '.contact-info-grid, .faq-grid, .services-grid'
    );
    
    staggerContainers.forEach(container => {
        const children = container.querySelectorAll('[data-stagger]');
        
        if (children.length === 0) return;
        
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
                y: 40,
                scale: 0.98
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.08,
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
        
        const container = element.closest('.project-image, .about-intro-image, .about-image');
        if (!container) return;
        
        gsap.to(element, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
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

// Premium hero animations
function initHeroAnimations() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    if (!gsap) {
        const heroElements = heroSection.querySelectorAll(
            '.hero-eyebrow, .hero-title-line, .hero-text, .hero-buttons, .hero-scroll'
        );
        heroElements.forEach(el => {
            if (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
        return;
    }
    
    // Cinematic hero timeline
    const timeline = gsap.timeline({ 
        delay: 1.8,
        onStart: () => {
            document.body.classList.add('hero-animating');
        }
    });
    
    // Eyebrow reveal
    const eyebrow = heroSection.querySelector('.hero-eyebrow');
    if (eyebrow) {
        timeline.fromTo(eyebrow,
            { 
                opacity: 0, 
                y: 30,
                filter: 'blur(10px)'
            },
            { 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8, 
                ease: 'power2.out' 
            }
        );
    }
    
    // Title lines reveal with premium easing
    const titleLines = heroSection.querySelectorAll('.hero-title-line');
    if (titleLines.length > 0) {
        timeline.fromTo(titleLines,
            { 
                opacity: 0, 
                y: 80,
                rotationX: -15,
                filter: 'blur(8px)'
            },
            { 
                opacity: 1, 
                y: 0,
                rotationX: 0,
                filter: 'blur(0px)',
                duration: 1,
                stagger: 0.12,
                ease: 'power3.out'
            },
            '-=0.4'
        );
    }
    
    // Hero text reveal
    const heroText = heroSection.querySelector('.hero-text');
    if (heroText) {
        timeline.fromTo(heroText,
            { 
                opacity: 0, 
                y: 30,
                filter: 'blur(6px)'
            },
            { 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)',
                duration: 0.8, 
                ease: 'power2.out' 
            },
            '-=0.6'
        );
    }
    
    // Buttons reveal
    const heroButtons = heroSection.querySelector('.hero-buttons');
    if (heroButtons) {
        const buttons = heroButtons.querySelectorAll('.btn');
        timeline.fromTo(buttons,
            { 
                opacity: 0, 
                y: 30,
                scale: 0.95
            },
            { 
                opacity: 1, 
                y: 0,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'back.out(1.2)'
            },
            '-=0.4'
        );
    }
    
    // Scroll indicator
    const heroScroll = heroSection.querySelector('.hero-scroll');
    if (heroScroll) {
        timeline.fromTo(heroScroll,
            { opacity: 0, y: -20 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.6, 
                ease: 'power2.out' 
            },
            '-=0.3'
        );
    }
}

// Page header animations
function initPageHeaderAnimations() {
    const pageHero = document.querySelector('.page-hero');
    if (!pageHero || document.querySelector('.hero')) return;
    
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
    
    const timeline = gsap.timeline({ delay: 1.5 });
    
    const eyebrow = pageHero.querySelector('.page-eyebrow');
    const title = pageHero.querySelector('.page-title');
    const subtitle = pageHero.querySelector('.page-subtitle');
    
    if (eyebrow) {
        timeline.fromTo(eyebrow,
            { opacity: 0, y: 20, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
        );
    }
    
    if (title) {
        timeline.fromTo(title,
            { opacity: 0, y: 50, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
            '-=0.3'
        );
    }
    
    if (subtitle) {
        timeline.fromTo(subtitle,
            { opacity: 0, y: 30, filter: 'blur(6px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' },
            '-=0.4'
        );
    }
}

// Service item hover animations
function initServiceItemAnimations() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        const arrow = item.querySelector('.service-arrow');
        if (!arrow || !gsap) return;
        
        item.addEventListener('mouseenter', () => {
            gsap.to(arrow, {
                x: 10,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(arrow, {
                x: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// Project card animations (desktop only)
function initProjectCardAnimations() {
    if (window.innerWidth <= 1024) return;
    
    const projectCards = document.querySelectorAll('.project-card, .project-card-large');
    
    projectCards.forEach(card => {
        const image = card.querySelector('.image-placeholder');
        if (!image || !gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.06,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    });
    
    // Template cards
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        const image = card.querySelector('.image-placeholder');
        if (!image || !gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(image, {
                scale: 1.08,
                duration: 0.7,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(image, {
                scale: 1,
                duration: 0.7,
                ease: 'power2.out'
            });
        });
    });
    
    // Pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        if (!gsap) return;
        
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        });
    });
}

// Magnetic button effect (desktop only, subtle)
function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-primary, .nav-cta');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle magnetic effect
            gsap.to(button, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// Footer entrance animation
ScrollTrigger.create({
    trigger: '.footer',
    start: 'top 90%',
    once: true,
    onEnter: () => {
        const footerElements = document.querySelectorAll('.footer-logo, .footer-tagline');
        const footerLinks = document.querySelectorAll('.footer-links, .footer-contact');
        
        if (gsap) {
            gsap.fromTo(footerElements,
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    stagger: 0.1,
                    ease: 'power2.out' 
                }
            );
            
            gsap.fromTo(footerLinks,
                { opacity: 0, y: 20 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    stagger: 0.1,
                    delay: 0.2,
                    ease: 'power2.out' 
                }
            );
        }
    }
});
