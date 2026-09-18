// Custom Cursor - HAVEN Premium Digital Agency
// Sophisticated cursor interactions (desktop only)

function initCursor() {
    // Only on desktop, not touch devices
    if (window.havenUtils.isTouchDevice() || window.innerWidth < 1024) {
        return;
    }
    
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorText = document.querySelector('.cursor-text');
    
    if (!cursor || !cursorDot || !cursorOutline) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Smooth cursor following with interpolation
    const CURSOR_SPEED = 0.18;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor with smooth following effect
    function animateCursor() {
        // Smooth interpolation
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * CURSOR_SPEED;
        cursorY += dy * CURSOR_SPEED;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .project-card, .template-card, .service-item, .filter-btn, ' +
        'input, textarea, select, .pricing-card, .nav-logo'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('link');
            
            // Check for custom cursor text
            const cursorTextValue = element.dataset.cursorText;
            if (cursorTextValue) {
                cursor.classList.remove('link');
                cursor.classList.add('hover');
                if (cursorText) {
                    cursorText.textContent = cursorTextValue;
                }
            }
            
            // Special handling for project cards
            if (element.classList.contains('project-card') || 
                element.classList.contains('project-card-large')) {
                cursor.classList.remove('link');
                cursor.classList.add('hover');
                if (cursorText) {
                    cursorText.textContent = 'VIEW';
                }
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('link', 'hover');
            if (cursorText) {
                cursorText.textContent = '';
            }
        });
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    // Update cursor on window resize
    window.addEventListener('resize', window.havenUtils.debounce(() => {
        if (window.innerWidth < 1024 || window.havenUtils.isTouchDevice()) {
            cursor.style.display = 'none';
        } else {
            cursor.style.display = 'block';
        }
    }, 250));
    
    // Cursor click effect
    document.addEventListener('mousedown', () => {
        if (gsap) {
            gsap.to(cursorOutline, {
                scale: 0.85,
                duration: 0.2,
                ease: 'power2.out'
            });
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (gsap) {
            gsap.to(cursorOutline, {
                scale: 1,
                duration: 0.3,
                ease: 'elastic.out(1, 0.5)'
            });
        }
    });
}

// Ensure cursor is hidden on touch devices
if (window.havenUtils && window.havenUtils.isTouchDevice()) {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.display = 'none';
    }
}
