// Custom Cursor Functionality

function initCursor() {
    // Only initialize on desktop devices
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
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animate cursor with smooth following effect
    function animateCursor() {
        // Smooth interpolation for cursor position
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .template-card, .service-item, .filter-btn, input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('link');
            
            // Check for custom cursor text
            const cursorTextValue = element.dataset.cursorText;
            if (cursorTextValue) {
                cursor.classList.add('hover');
                cursor.classList.remove('link');
                if (cursorText) {
                    cursorText.textContent = cursorTextValue;
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
        if (window.innerWidth < 1024) {
            cursor.style.display = 'none';
        } else if (!window.havenUtils.isTouchDevice()) {
            cursor.style.display = 'block';
        }
    }, 250));
}

// Remove cursor on touch devices
if (window.havenUtils && window.havenUtils.isTouchDevice()) {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.display = 'none';
    }
}
