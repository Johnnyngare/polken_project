// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initProjectFilters();
    initImageGallery();
    initCounters();
    initContactForm();
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
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

// Scroll animations
function initScrollAnimations() {
    const fadeElems = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElems.forEach(elem => fadeObserver.observe(elem));
}

// Project filtering
// Update the project filter function in main.js
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects-filter button');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline-primary');
            });
            
            // Add active class to clicked button
            button.classList.remove('btn-outline-primary');
            button.classList.add('btn-primary');
            
            const filter = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.style.opacity = '1', 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            });
        });
    });
}

// Image gallery
function initImageGallery() {
    const galleryItems = document.querySelectorAll('.project-card .card-img-wrapper');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const title = this.closest('.project-card').querySelector('.card-title').textContent;
            
            showImageModal(imgSrc, title);
        });
    });
}

function showImageModal(imgSrc, title) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${imgSrc}" alt="${title}">
            <h3>${title}</h3>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Counter animations
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const increment = target / speed;

        function updateCounter() {
            const count = +counter.innerText;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCounter, 1);
            } else {
                counter.innerText = target;
            }
        }

        updateCounter();
    });
}

// Contact form validation
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        message: this.querySelector('[name="message"]').value
    };

    const validation = validateFormData(formData);
    
    if (validation.isValid) {
        showFormMessage(this, 'success', 'Message sent successfully!');
        this.reset();
    } else {
        showFormMessage(this, 'error', validation.errors);
    }
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
    const existingMessages = form.querySelectorAll('.alert');
    existingMessages.forEach(msg => msg.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
    messageDiv.innerHTML = Array.isArray(message) ? message.join('<br>') : message;
    
    form.appendChild(messageDiv);

    setTimeout(() => messageDiv.remove(), 5000);
}
