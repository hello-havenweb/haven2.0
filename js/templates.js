// Template Filtering Functionality - HAVEN Premium Digital Agency

function initTemplateFilters() {
    const filterBtns = document.querySelectorAll('.template-filters .filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    const noResults = document.querySelector('.templates-section .no-results');
    
    if (!filterBtns.length || !templateCards.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button with smooth transition
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter templates with premium animation
            filterTemplates(filter, templateCards, noResults);
        });
    });
}

// Filter templates with premium animation
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
                    { 
                        opacity: 0, 
                        y: 40,
                        scale: 0.95 
                    },
                    { 
                        opacity: 1, 
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        delay: index * 0.08,
                        ease: 'power2.out'
                    }
                );
            } else {
                card.style.opacity = '1';
                card.style.transform = 'none';
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
        }, 700);
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
        
        // Premium hover effect for entire card
        if (window.innerWidth > 1024 && typeof gsap !== 'undefined') {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -6,
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
        }
    });
}

// Initialize template card interactions on load
document.addEventListener('DOMContentLoaded', () => {
    initTemplateCardInteractions();
});

// Search functionality (future enhancement)
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
                
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card,
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                    );
                } else {
                    card.style.opacity = '1';
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.95,
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
    }, 300));
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
    
    // Animate out
    if (typeof gsap !== 'undefined') {
        gsap.to(templateCards, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            stagger: 0.02,
            ease: 'power2.in',
            onComplete: () => {
                // Re-append sorted cards
                templateCards.forEach(card => {
                    templatesGrid.appendChild(card);
                });
                
                // Animate in
                gsap.fromTo(templateCards,
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5,
                        stagger: 0.05,
                        ease: 'power2.out'
                    }
                );
                
                // Refresh ScrollTrigger
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }
        });
    } else {
        // Fallback without animation
        templateCards.forEach(card => {
            templatesGrid.appendChild(card);
        });
    }
}

// Template quick view modal (future enhancement)
function openTemplatePreview(templateId) {
    // This would create a modal overlay with template preview
    // For now, this is a placeholder for future implementation
    console.log('Opening template preview for:', templateId);
    
    // Future implementation could include:
    // - Full-screen modal
    // - Template screenshot carousel
    // - Feature list
    // - Live demo link
    // - Purchase/customize options
}

// Export functions for external use
window.templateFilters = {
    initTemplateFilters,
    filterTemplates,
    sortTemplates,
    openTemplatePreview
};
