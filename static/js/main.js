// Debug logging
console.log('Main.js loaded');

// Animation options for observers
const animationOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('DOM Content Loaded');
        // Add a small delay to ensure elements are rendered
        setTimeout(() => {
            initNavbar();
            initSmoothScroll();
            initCounters();
            initScrollAnimations();
            initProjectFilters();
            initVideoGallery();
            initContactForm();
            initHeroAnimations();
            initParallaxEffects();
            initAboutSection();
        }, 100);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    console.log('Found counters:', counters.length);
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        
        const updateCounter = () => {
            const increment = target / 50;
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                counter.textContent = '0';
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Scroll animations
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.warn('IntersectionObserver not supported');
        return;
    }

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!entry.target.hasAttribute('data-no-unobserve')) {
                    fadeObserver.unobserve(entry.target);
                }
            }
        });
    }, animationOptions);

    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, .fade-in-up')
        .forEach(elem => fadeObserver.observe(elem));
}

// Project filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects-filter button');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-primary', 'active');
                btn.classList.add('btn-outline-primary');
            });
            
            this.classList.add('btn-primary', 'active');
            this.classList.remove('btn-outline-primary');
            
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Video Gallery Handling
function initVideoGallery() {
    const video = document.getElementById('sequential-video');
    const titleEl = document.getElementById('video-title');
    const descEl = document.getElementById('video-description');
    let currentSource = 0;
    const sources = Array.from(video.getElementsByTagName('source'));
 
    // Preload video metadata
    video.preload = "metadata";
 
    // Lazy loading with Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            playVideo();
            observer.unobserve(video);
        }
    }, {
        threshold: 0.5
    });
 
    observer.observe(video);
 
    function updateDescription() {
        const source = sources[currentSource];
        if (source) {
            titleEl.textContent = source.dataset.title;
            descEl.textContent = source.dataset.description;
        }
    }
 
    async function playVideo() {
        try {
            // Cache video source
            const currentVideoSrc = sources[currentSource].src;
            video.src = currentVideoSrc;
            
            await video.load();
            await video.play();
            updateDescription();
        } catch (error) {
            console.error('Video playback error:', error);
            // Try next video if current fails
            currentSource = (currentSource + 1) % sources.length;
            playVideo();
        }
    }
 
    video.addEventListener('ended', async function() {
        currentSource = (currentSource + 1) % sources.length;
        await playVideo();
    });
 
    // Error handling
    video.addEventListener('error', function(e) {
        console.error('Video error:', e);
        currentSource = (currentSource + 1) % sources.length;
        playVideo();
    });
 
    // Memory cleanup
    return () => {
        observer.disconnect();
        video.removeEventListener('ended', playVideo);
        video.removeEventListener('error', playVideo);
    };
 }

// Contact Form Handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.querySelector('[name="name"]')?.value || '',
            email: this.querySelector('[name="email"]')?.value || '',
            message: this.querySelector('[name="message"]')?.value || ''
        };
    
        const validation = validateFormData(formData);
        
        if (validation.isValid) {
            showFormMessage(this, 'success', 'Message sent successfully!');
            this.reset();
        } else {
            showFormMessage(this, 'error', validation.errors);
        }
    });
}

function validateFormData(data) {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.name.trim()) errors.push('Name is required');
    if (!emailRegex.test(data.email)) errors.push('Please enter a valid email address');
    if (!data.message.trim()) errors.push('Message is required');

    return {
        isValid: errors.length === 0,
        errors
    };
}

function showFormMessage(form, type, message) {
    form.querySelectorAll('.alert').forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.innerHTML = Array.isArray(message) ? message.join('<br>') : message;
    
    form.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

// Hero Animations
function initHeroAnimations() {
    document.querySelectorAll('.animate-up').forEach((el, index) => {
        el.style.cssText = 'opacity: 0; transform: translateY(30px);';
        
        setTimeout(() => {
            el.style.transition = 'all 0.8s ease';
            el.style.cssText = 'opacity: 1; transform: translateY(0);';
        }, index * 200);
    });
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translate3d(0, ${-(scrolled * speed)}px, 0)`;
        });
    });
}

// About Section Animation
function initAboutSection() {
    const aboutSection = document.querySelector('.about-section');
    if (!aboutSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(aboutSection);
}

// Helper function to check viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}