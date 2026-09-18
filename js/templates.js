// Template Filtering Functionality

function initTemplateFilters() {
    const filterBtns = document.querySelectorAll('.template-filters .filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const noResults = document.querySelector('.templates-section .no-results');
    
    if (!filterBtns.length || !templateCards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter templates
            filterTemplates(filter, templateCards, noResults);
        });
    });
}

// Filter templates with animation
function filterTemplates(filter, cards, noResults) {
    let visibleCount = 0;
    
    cards.forEach((card, index) => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
            // Show card
            card.style.display = 'block';
            visibleCount++;
            
            // Animate in with stagger
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(card,
                    { opacity: 0, y: 30, scale: 0.95 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        duration: 0.5,
                        delay: index * 0.05,
                        ease: 'power2.out'
                    }
                );
            } else {
                card.style.opacity = '1';
            }
        } else {
            // Hide card
            if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.3,
                    ease: 'power2.in',
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
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(noResults,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                );
            }
        } else {
            noResults.style.display = 'none';
        }
    }
    
    // Refresh ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 600);
    }
}

// Template card interactions
function initTemplateCardInteractions() {
    const templateCards = document.querySelectorAll('.template-card');
    
    templateCards.forEach(card => {
        const buttons = card.querySelectorAll('.btn');
        
        // Prevent card click when clicking buttons
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Add hover effect for entire card
        card.addEventListener('mouseenter', () => {
            if (typeof gsap !== 'undefined' && !window.havenUtils.prefersReducedMotion()) {
                gsap.to(card, {
                    y: -4,
                    boxShadow: '0 10px 40px rgba(124, 58, 237, 0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined' && !window.havenUtils.prefersReducedMotion()) {
                gsap.to(card, {
                    y: 0,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}

// Initialize template card interactions
document.addEventListener('DOMContentLoaded', () => {
    initTemplateCardInteractions();
});

// Search functionality (if needed in future)
function initTemplateSearch() {
    const searchInput = document.querySelector('.template-search');
    
    if (!searchInput) return;
    
    const templateCards = document.querySelectorAll('.template-card');
    
    searchInput.addEventListener('input', window.havenUtils.debounce((e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        templateCards.forEach(card => {
            const title = card.querySelector('.template-title').textContent.toLowerCase();
            const description = card.querySelector('.template-description').textContent.toLowerCase();
            const category = card.dataset.category.toLowerCase();
            
            if (title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                category.includes(searchTerm) ||
                searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }, 300));
}

// Template quick view modal (future enhancement)
function initTemplateQuickView() {
    const viewButtons = document.querySelectorAll('[data-template-view]');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const templateId = btn.dataset.templateView;
            
            // Open modal with template preview
            // This would require additional modal markup
            console.log('Opening template preview for:', templateId);
        });
    });
}

// Sort templates
function sortTemplates(sortBy) {
    const templatesGrid = document.querySelector('.templates-grid');
    if (!templatesGrid) return;
    
    const templateCards = Array.from(templatesGrid.querySelectorAll('.template-card'));
    
    templateCards.sort((a, b) => {
        if (sortBy === 'name') {
            const nameA = a.querySelector('.template-title').textContent;
            const nameB = b.querySelector('.template-title').textContent;
            return nameA.localeCompare(nameB);
        } else if (sortBy === 'category') {
            return a.dataset.category.localeCompare(b.dataset.category);
        }
        return 0;
    });
    
    // Re-append sorted cards
    templateCards.forEach(card => {
        templatesGrid.appendChild(card);
    });
    
    // Refresh animations
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
}

// Export functions for external use
window.templateFilters = {
    initTemplateFilters,
    filterTemplates,
    sortTemplates
};
