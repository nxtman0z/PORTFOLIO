// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const typewriter = document.getElementById('typewriter');

// Navigation functionality
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
    
    // Update active nav link
    updateActiveNavLink();
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    
    if (document.body.classList.contains('light-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const icon = themeToggle.querySelector('i');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Typewriter effect
function typeWriter() {
    const text = "Manoj";
    let i = 0;
    const speed = 100;
    
    function type() {
        if (i < text.length) {
            typewriter.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add cursor blink effect
            setTimeout(() => {
                typewriter.style.borderRight = '2px solid transparent';
                setTimeout(() => {
                    typewriter.style.borderRight = '2px solid var(--primary-color)';
                }, 500);
            }, 1000);
        }
    }
    
    typewriter.textContent = '';
    typewriter.style.borderRight = '2px solid var(--primary-color)';
    type();
}

// Animate skill bars when they come into view
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Fade in animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Form validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
    });
    
    // Validate name
    if (name === '') {
        document.getElementById('name-error').textContent = 'Name is required';
        isValid = false;
    } else if (name.length < 2) {
        document.getElementById('name-error').textContent = 'Name must be at least 2 characters';
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('email-error').textContent = 'Email is required';
        isValid = false;
    } else if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate subject
    if (subject === '') {
        document.getElementById('subject-error').textContent = 'Subject is required';
        isValid = false;
    } else if (subject.length < 5) {
        document.getElementById('subject-error').textContent = 'Subject must be at least 5 characters';
        isValid = false;
    }
    
    // Validate message
    if (message === '') {
        document.getElementById('message-error').textContent = 'Message is required';
        isValid = false;
    } else if (message.length < 10) {
        document.getElementById('message-error').textContent = 'Message must be at least 10 characters';
        isValid = false;
    }
    
    return isValid;
}

// Handle form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Show success message (in a real application, you would send the data to a server)
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    } else {
        showNotification('Please correct the errors above.', 'error');
    }
});

// Show notification
function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Real-time form validation
document.getElementById('name').addEventListener('input', function() {
    const value = this.value.trim();
    const errorElement = document.getElementById('name-error');
    
    if (value === '') {
        errorElement.textContent = 'Name is required';
    } else if (value.length < 2) {
        errorElement.textContent = 'Name must be at least 2 characters';
    } else {
        errorElement.textContent = '';
    }
});

document.getElementById('email').addEventListener('input', function() {
    const value = this.value.trim();
    const errorElement = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        errorElement.textContent = 'Email is required';
    } else if (!emailRegex.test(value)) {
        errorElement.textContent = 'Please enter a valid email address';
    } else {
        errorElement.textContent = '';
    }
});

document.getElementById('subject').addEventListener('input', function() {
    const value = this.value.trim();
    const errorElement = document.getElementById('subject-error');
    
    if (value === '') {
        errorElement.textContent = 'Subject is required';
    } else if (value.length < 5) {
        errorElement.textContent = 'Subject must be at least 5 characters';
    } else {
        errorElement.textContent = '';
    }
});

document.getElementById('message').addEventListener('input', function() {
    const value = this.value.trim();
    const errorElement = document.getElementById('message-error');
    
    if (value === '') {
        errorElement.textContent = 'Message is required';
    } else if (value.length < 10) {
        errorElement.textContent = 'Message must be at least 10 characters';
    } else {
        errorElement.textContent = '';
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                let currentValue = 0;
                const increment = finalValue / 50; // Adjust speed here
                
                const updateCounter = () => {
                    if (currentValue < finalValue) {
                        currentValue += increment;
                        target.textContent = Math.ceil(currentValue) + (target.textContent.includes('+') ? '+' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.textContent = finalValue + (target.textContent.includes('+') ? '+' : '');
                    }
                };
                
                updateCounter();
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Parallax effect for hero background
function parallaxEffect() {
    const heroBackground = document.querySelector('.hero-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Add loading animation
function showLoadingAnimation() {
    const body = document.body;
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading...</p>
        </div>
    `;
    
    // Add loading styles
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s ease;
    `;
    
    const spinnerStyles = `
        .loading-spinner {
            text-align: center;
            color: var(--light-text);
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = spinnerStyles;
    document.head.appendChild(styleSheet);
    
    body.appendChild(loadingOverlay);
    
    // Remove loading overlay after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
                styleSheet.remove();
            }, 500);
        }, 1000);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show loading animation
    showLoadingAnimation();
    
    // Load saved theme
    loadTheme();
    
    // Start typewriter effect
    setTimeout(() => {
        typeWriter();
    }, 1500);
    
    // Initialize animations
    animateOnScroll();
    animateSkillBars();
    animateCounters();
    
    // Initialize parallax effect
    parallaxEffect();
    
    // Set initial active nav link
    setTimeout(updateActiveNavLink, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add some interactive effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add hover effects to tech icons
document.querySelectorAll('.tech-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// Add click ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        // Add ripple animation if not already added
        if (!document.querySelector('#ripple-styles')) {
            const rippleStyles = document.createElement('style');
            rippleStyles.id = 'ripple-styles';
            rippleStyles.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyles);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Enter or Space to activate buttons and links
    if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.classList.contains('btn') || e.target.classList.contains('nav-link')) {
            e.target.click();
        }
    }
});

// Add focus styles for accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Progressive enhancement for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--animation-duration', '0s');
    document.documentElement.style.setProperty('--transition-duration', '0s');
}

// Performance optimization: Intersection Observer for heavy animations
const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Enable animations only when elements are visible
            entry.target.style.animationPlayState = 'running';
        } else {
            // Pause animations when elements are not visible
            entry.target.style.animationPlayState = 'paused';
        }
    });
});

// Apply performance optimization to animated elements
document.querySelectorAll('.hero-bg, .typewriter').forEach(element => {
    performanceObserver.observe(element);
});

// Handle network status
window.addEventListener('online', () => {
    showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', () => {
    showNotification('No internet connection', 'error');
});

// Add scroll progress indicator
function createScrollProgress() {
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: var(--gradient);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(scrollProgress);
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxScroll) * 100;
        scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize scroll progress
createScrollProgress();

// Add easter egg (Konami code)
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s infinite';
        showNotification('🎉 Easter egg activated! You found the secret!', 'success');
        
        // Add rainbow animation
        if (!document.querySelector('#rainbow-styles')) {
            const rainbowStyles = document.createElement('style');
            rainbowStyles.id = 'rainbow-styles';
            rainbowStyles.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(rainbowStyles);
        }
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Apply lazy loading to project images
document.querySelectorAll('.project-image img').forEach(img => {
    img.classList.add('lazy');
    img.dataset.src = img.src;
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    imageObserver.observe(img);
});

// Add CSS for lazy loading
if (!document.querySelector('#lazy-styles')) {
    const lazyStyles = document.createElement('style');
    lazyStyles.id = 'lazy-styles';
    lazyStyles.textContent = `
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        .lazy:not([src*="data:image"]) {
            opacity: 1;
        }
    `;
    document.head.appendChild(lazyStyles);
}

// Add copy to clipboard functionality for contact details
document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', async () => {
        const text = item.querySelector('span').textContent;
        
        try {
            await navigator.clipboard.writeText(text);
            showNotification(`Copied "${text}" to clipboard!`, 'success');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });
    
    // Add cursor pointer style
    item.style.cursor = 'pointer';
    item.title = 'Click to copy';
});

// Debug mode (activate with URL parameter ?debug=true)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('debug') === 'true') {
    console.log('🔧 Debug mode activated!');
    console.log('Portfolio initialized successfully');
    
    // Add debug panel
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
    `;
    debugPanel.innerHTML = `
        <div>Debug Mode Active</div>
        <div>Theme: <span id="debug-theme"></span></div>
        <div>Scroll: <span id="debug-scroll">0</span></div>
        <div>Viewport: <span id="debug-viewport"></span></div>
    `;
    document.body.appendChild(debugPanel);
    
    // Update debug info
    function updateDebugInfo() {
        document.getElementById('debug-theme').textContent = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
        document.getElementById('debug-scroll').textContent = Math.round(window.scrollY);
        document.getElementById('debug-viewport').textContent = `${window.innerWidth}x${window.innerHeight}`;
    }
    
    window.addEventListener('scroll', updateDebugInfo);
    window.addEventListener('resize', updateDebugInfo);
    updateDebugInfo();
}

// Service Worker registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

console.log('🚀 Portfolio loaded successfully!');
console.log('💡 Tip: Add ?debug=true to the URL for debug mode');
console.log('🎮 Try the Konami code: ↑↑↓↓←→←→BA');

