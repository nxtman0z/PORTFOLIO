// Enhanced Java & Blockchain Portfolio JavaScript
// Modern ES6+ JavaScript with advanced animations and interactions

// ===========================
// GLOBAL VARIABLES & CONFIG
// ===========================

const CONFIG = {
    ANIMATION_DURATION: 2000,
    SCROLL_THRESHOLD: 100,
    TYPEWRITER_SPEED: 100,
    LOADING_DURATION: 3000,
    PARTICLE_COUNT: 50,
    MATRIX_COLUMNS: 20,
    API_ENDPOINTS: {
        GITHUB: 'https://api.github.com/users/nxtman0z',
        PORTFOLIO: 'https://nxtman0z.github.io'
    }
};

// Global state management
const STATE = {
    isLoading: true,
    currentTheme: 'dark',
    activeSection: 'home',
    walletConnected: false,
    notifications: [],
    currentRole: 0,
    roles: ['java', 'blockchain', 'web3'],
    animations: {
        particles: null,
        matrixRain: null,
        blockchainCanvas: null
    }
};

// DOM Elements Cache
const DOM = {
    body: document.body,
    navbar: document.getElementById('navbar'),
    hamburger: document.getElementById('hamburger'),
    navMenu: document.getElementById('nav-menu'),
    themeToggle: document.getElementById('theme-toggle'),
    walletConnect: document.getElementById('wallet-connect'),
    loadingScreen: document.getElementById('loading-screen'),
    backToTop: document.getElementById('back-to-top'),
    contactForm: document.getElementById('contact-form'),
    typewriter: document.getElementById('typewriter'),
    blockchainCanvas: document.getElementById('blockchain-canvas'),
    cryptoRain: document.getElementById('crypto-rain'),
    networkNodes: document.getElementById('network-nodes'),
    dataFlow: document.getElementById('data-flow')
};

// ===========================
// UTILITY FUNCTIONS
// ===========================

const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },

    // Generate random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Generate random integer between min and max
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Smooth scroll to element
    smoothScrollTo(element, offset = 100) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Get current timestamp
    getCurrentTimestamp() {
        return new Date().toISOString();
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Local storage set error:', error);
                return false;
            }
        },
        get(key) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (error) {
                console.error('Local storage get error:', error);
                return null;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Local storage remove error:', error);
                return false;
            }
        }
    }
};

// ===========================
// LOADING SCREEN ANIMATION
// ===========================

class LoadingScreen {
    constructor() {
        this.progress = 0;
        this.targetProgress = 100;
        this.isComplete = false;
        this.init();
    }

    init() {
        this.createLoadingElements();
        this.startProgress();
    }

    createLoadingElements() {
        if (!DOM.loadingScreen) return;
        
        // Add percentage display
        const percentageEl = DOM.loadingScreen.querySelector('.loading-percentage');
        if (percentageEl) {
            this.percentageEl = percentageEl;
        }

        // Update loading text for Java & Blockchain
        const loadingText = DOM.loadingScreen.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = 'Initializing Java & Web3 Portfolio...';
        }
    }

    startProgress() {
        const progressInterval = setInterval(() => {
            this.progress += Utils.random(1, 3);
            
            if (this.progress >= this.targetProgress) {
                this.progress = 100;
                clearInterval(progressInterval);
                setTimeout(() => this.hide(), 500);
            }
            
            this.updateProgress();
        }, 50);
    }

    updateProgress() {
        if (this.percentageEl) {
            this.percentageEl.textContent = `${Math.round(this.progress)}%`;
        }
    }

    hide() {
        if (DOM.loadingScreen) {
            DOM.loadingScreen.classList.add('hidden');
            setTimeout(() => {
                DOM.loadingScreen.style.display = 'none';
                STATE.isLoading = false;
                this.onLoadingComplete();
            }, 500);
        }
    }

    onLoadingComplete() {
        // Initialize all animations after loading
        document.dispatchEvent(new CustomEvent('loadingComplete'));
        
        // Initialize blockchain canvas
        if (window.blockchainCanvas) {
            window.blockchainCanvas.init();
        }
        
        // Start typewriter effect
        setTimeout(() => {
            if (window.typewriterEffect) {
                window.typewriterEffect.start();
            }
        }, 1000);
    }
}

// ===========================
// NAVIGATION SYSTEM
// ===========================

class NavigationSystem {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initScrollSpy();
        this.initSmoothScroll();
    }

    bindEvents() {
        // Hamburger menu toggle
        if (DOM.hamburger) {
            DOM.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close menu when clicking nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMobileMenu();
                this.handleNavClick(e);
            });
        });

        // Theme toggle
        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Wallet connect
        if (DOM.walletConnect) {
            DOM.walletConnect.addEventListener('click', () => this.handleWalletConnect());
        }

        // Scroll events
        window.addEventListener('scroll', Utils.throttle(() => this.handleScroll(), 10));
        
        // Resize events
        window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (DOM.hamburger && DOM.navMenu) {
            DOM.hamburger.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
            DOM.body.classList.toggle('no-scroll', this.isMenuOpen);
        }
    }

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            DOM.hamburger?.classList.remove('active');
            DOM.navMenu?.classList.remove('active');
            DOM.body.classList.remove('no-scroll');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                Utils.smoothScrollTo(targetElement);
                
                // Update active state
                this.updateActiveNavLink(targetId.substring(1));
            }
        }
    }

    toggleTheme() {
        const newTheme = STATE.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        STATE.currentTheme = theme;
        DOM.body.classList.toggle('light-mode', theme === 'light');
        
        // Update theme toggle icon
        const icon = DOM.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Save theme preference
        Utils.storage.set('theme', theme);
    }

    loadSavedTheme() {
        const savedTheme = Utils.storage.get('theme') || 'dark';
        this.setTheme(savedTheme);
    }

    handleWalletConnect() {
        if (STATE.walletConnected) {
            this.disconnectWallet();
        } else {
            this.connectWallet();
        }
    }

    async connectWallet() {
        try {
            // Simulate wallet connection (replace with actual Web3 logic)
            NotificationSystem.show('Connecting to wallet...', 'info');
            
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                STATE.walletConnected = true;
                this.updateWalletButton();
                NotificationSystem.show('Wallet connected successfully!', 'success');
            } else {
                NotificationSystem.show('Please install MetaMask to connect your wallet', 'warning');
            }
        } catch (error) {
            console.error('Wallet connection error:', error);
            NotificationSystem.show('Failed to connect wallet', 'error');
        }
    }

    disconnectWallet() {
        STATE.walletConnected = false;
        this.updateWalletButton();
        NotificationSystem.show('Wallet disconnected', 'info');
    }

    updateWalletButton() {
        const button = DOM.walletConnect;
        if (button) {
            const span = button.querySelector('span');
            const icon = button.querySelector('i');
            
            if (STATE.walletConnected) {
                span.textContent = 'Disconnect';
                icon.className = 'fas fa-unlink';
                button.style.background = 'var(--success-color)';
            } else {
                span.textContent = 'Connect Wallet';
                icon.className = 'fas fa-wallet';
                button.style.background = '';
            }
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Update navbar appearance
        if (DOM.navbar) {
            DOM.navbar.classList.toggle('scrolled', scrollY > CONFIG.SCROLL_THRESHOLD);
        }
        
        // Show/hide back to top button
        if (DOM.backToTop) {
            DOM.backToTop.classList.toggle('show', scrollY > 500);
        }
        
        // Update active section
        this.updateActiveSection();
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveNavLink(entry.target.id);
                }
            });
        }, {
            rootMargin: '-100px 0px -66%',
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavLink(activeId) {
        STATE.activeSection = activeId;
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    initSmoothScroll() {
        // Handle back to top button
        if (DOM.backToTop) {
            DOM.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId !== '#' && !anchor.classList.contains('nav-link')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        Utils.smoothScrollTo(targetElement);
                    }
                }
            });
        });
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (STATE.activeSection !== sectionId) {
                    this.updateActiveNavLink(sectionId);
                }
            }
        });
    }
}

// ===========================
// TYPEWRITER EFFECT
// ===========================

class TypewriterEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.words = options.words || ['Manoj Kumar'];
        this.currentWord = 0;
        this.currentChar = 0;
        this.isDeleting = false;
        this.speed = options.speed || CONFIG.TYPEWRITER_SPEED;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.element.textContent = '';
        this.createCursor();
    }

    createCursor() {
        const cursor = document.querySelector('.blockchain-cursor');
        if (cursor) {
            this.cursor = cursor;
        }
    }

    start() {
        this.type();
    }

    type() {
        const currentWord = this.words[this.currentWord];
        
        if (this.isDeleting) {
            this.element.textContent = currentWord.substring(0, this.currentChar - 1);
            this.currentChar--;
        } else {
            this.element.textContent = currentWord.substring(0, this.currentChar + 1);
            this.currentChar++;
        }

        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.currentChar === currentWord.length) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentChar === 0) {
            this.isDeleting = false;
            this.currentWord = (this.currentWord + 1) % this.words.length;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ===========================
// ROLE CARD ROTATION SYSTEM
// ===========================

class RoleCardRotation {
    constructor() {
        this.roleCards = document.querySelectorAll('.role-card');
        this.currentIndex = 0;
        this.interval = null;
        this.init();
    }

    init() {
        if (this.roleCards.length === 0) return;
        this.startRotation();
        this.bindHoverEvents();
    }

    startRotation() {
        // Set first card as active
        this.updateActiveCard();
        
        // Start automatic rotation
        this.interval = setInterval(() => {
            this.nextRole();
        }, 4000); // Change every 4 seconds
    }

    nextRole() {
        this.currentIndex = (this.currentIndex + 1) % this.roleCards.length;
        this.updateActiveCard();
    }

    updateActiveCard() {
        this.roleCards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update global state
        STATE.currentRole = this.currentIndex;
    }

    bindHoverEvents() {
        this.roleCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                // Pause rotation on hover
                if (this.interval) {
                    clearInterval(this.interval);
                    this.interval = null;
                }
                
                // Activate hovered card
                this.currentIndex = index;
                this.updateActiveCard();
            });

            card.addEventListener('mouseleave', () => {
                // Resume rotation after hover
                if (!this.interval) {
                    this.interval = setInterval(() => {
                        this.nextRole();
                    }, 4000);
                }
            });
        });
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

class NotificationSystem {
    static show(message, type = 'info', duration = 5000) {
        const notification = this.create(message, type);
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        const timeout = setTimeout(() => {
            this.hide(notification);
        }, duration);

        // Handle close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(timeout);
                this.hide(notification);
            });
        }

        return notification;
    }

    static create(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <div class="notification-content">
                <i class="notification-icon ${icons[type] || icons.info}"></i>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        return notification;
    }

    static hide(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// ===========================
// BLOCKCHAIN CANVAS ANIMATION
// ===========================

class BlockchainCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.particles = [];
        this.animationId = null;
        this.colors = {
            java: '#f89820',
            blockchain: '#00d4ff',
            web3: '#7c3aed',
            success: '#10b981'
        };
        this.init();
    }

    init() {
        this.resize();
        this.createNodes();
        this.createConnections();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    createNodes() {
        const nodeCount = Math.floor((this.canvas.width * this.canvas.height) / 50000);
        this.nodes = [];
        
        for (let i = 0; i < nodeCount; i++) {
            const colorKeys = Object.keys(this.colors);
            const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
            
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Utils.random(2, 4),
                color: this.colors[randomColorKey],
                pulse: Math.random() * Math.PI * 2,
                speed: Utils.random(0.01, 0.03),
                type: randomColorKey
            });
        }
    }

    createConnections() {
        this.connections = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 150 && Math.random() < 0.3) {
                    this.connections.push({
                        nodeA: i,
                        nodeB: j,
                        opacity: Utils.random(0.1, 0.3),
                        color: this.getConnectionColor(this.nodes[i].type, this.nodes[j].type)
                    });
                }
            }
        }
    }

    getConnectionColor(typeA, typeB) {
        if (typeA === typeB) {
            return this.colors[typeA];
        }
        // Mixed connection color
        return this.colors.blockchain;
    }

    createParticles() {
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            const colorKeys = Object.keys(this.colors);
            const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
            
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: Utils.random(-1, 1),
                vy: Utils.random(-1, 1),
                size: Utils.random(1, 3),
                color: this.colors[randomColorKey],
                life: 1,
                decay: Utils.random(0.002, 0.005)
            });
        }
    }

    getDistance(nodeA, nodeB) {
        return Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Update and draw nodes
        this.updateNodes();
        this.drawNodes();
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        this.connections.forEach(connection => {
            const nodeA = this.nodes[connection.nodeA];
            const nodeB = this.nodes[connection.nodeB];
            
            this.ctx.beginPath();
            this.ctx.moveTo(nodeA.x, nodeA.y);
            this.ctx.lineTo(nodeB.x, nodeB.y);
            this.ctx.strokeStyle = `${connection.color}${Math.floor(connection.opacity * 255).toString(16).padStart(2, '0')}`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    updateNodes() {
        this.nodes.forEach(node => {
            node.pulse += node.speed;
            node.radius = 2 + Math.sin(node.pulse) * 1;
        });
    }

    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            this.ctx.fill();
            
            // Add glow effect
            this.ctx.shadowColor = node.color;
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    updateParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Remove dead particles
            if (particle.life <= 0) {
                const colorKeys = Object.keys(this.colors);
                const randomColorKey = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                
                this.particles[index] = {
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: Utils.random(-1, 1),
                    vy: Utils.random(-1, 1),
                    size: Utils.random(1, 3),
                    color: this.colors[randomColorKey],
                    life: 1,
                    decay: Utils.random(0.002, 0.005)
                };
            }
        });
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ===========================
// MATRIX RAIN EFFECT
// ===========================

class MatrixRainEffect {
    constructor(container) {
        this.container = container;
        if (!this.container) return;
        
        this.columns = [];
        this.characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+-=[]{}|;:,.<>?';
        this.javaChars = 'JavaSpringBootEclipseIDEMavenGradleHibernateJPA';
        this.blockchainChars = 'SolidityWeb3EthereumIPFSRustPolkadotSolanaAvalanche';
        this.matrixColumns = CONFIG.MATRIX_COLUMNS;
        this.animationId = null;
        this.init();
    }

    init() {
        this.createColumns();
        this.animate();
        
        window.addEventListener('resize', Utils.debounce(() => {
            this.destroy();
            this.createColumns();
            this.animate();
        }, 250));
    }

    createColumns() {
        this.container.innerHTML = '';
        this.columns = [];
        
        const columnWidth = this.container.offsetWidth / this.matrixColumns;
        
        for (let i = 0; i < this.matrixColumns; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = `${i * columnWidth}px`;
            column.style.animationDuration = `${Utils.random(5, 15)}s`;
            column.style.animationDelay = `${Utils.random(0, 5)}s`;
            
            // Mix different character sets
            const charSource = this.getCharacterSource(i);
            const charCount = Utils.randomInt(5, 15);
            
            for (let j = 0; j < charCount; j++) {
                const char = document.createElement('span');
                char.textContent = charSource.charAt(Utils.randomInt(0, charSource.length - 1));
                char.style.animationDelay = `${j * 0.1}s`;
                char.style.color = this.getColumnColor(i);
                column.appendChild(char);
            }
            
            this.container.appendChild(column);
            this.columns.push(column);
        }
    }

    getCharacterSource(columnIndex) {
        const sources = [this.characters, this.javaChars, this.blockchainChars];
        return sources[columnIndex % sources.length];
    }

    getColumnColor(columnIndex) {
        const colors = ['#10b981', '#f89820', '#00d4ff', '#7c3aed'];
        return colors[columnIndex % colors.length];
    }

    animate() {
        this.animationId = setInterval(() => {
            this.columns.forEach((column, index) => {
                if (Math.random() < 0.1) {
                    const chars = column.querySelectorAll('span');
                    const charSource = this.getCharacterSource(index);
                    chars.forEach(char => {
                        char.textContent = charSource.charAt(Utils.randomInt(0, charSource.length - 1));
                    });
                }
            });
        }, 100);
    }

    destroy() {
        if (this.animationId) {
            clearInterval(this.animationId);
            this.animationId = null;
        }
        this.container.innerHTML = '';
    }
}

// ===========================
// SKILL ANIMATION SYSTEM
// ===========================

class SkillAnimationSystem {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-fill');
        this.counters = document.querySelectorAll('.stat-number');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.networkItems = document.querySelectorAll('.network-item');
        this.init();
    }

    init() {
        this.initIntersectionObserver();
        this.bindSkillHover();
        this.initNetworkHover();
        this.setupSkillProgressBars();
    }

    initIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        // Skill bars observer
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkillBar(entry.target);
                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.skillBars.forEach(bar => skillObserver.observe(bar));

        // Counter observer
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.counters.forEach(counter => counterObserver.observe(counter));
    }

    animateSkillBar(skillBar) {
        const targetWidth = skillBar.getAttribute('data-skill');
        let currentWidth = 0;
        const increment = targetWidth / 100;
        const duration = 2000;
        const interval = duration / 100;

        const animation = setInterval(() => {
            currentWidth += increment;
            if (currentWidth >= targetWidth) {
                currentWidth = targetWidth;
                clearInterval(animation);
                
                // Add completion effect
                this.addSkillCompletionEffect(skillBar);
            }
            skillBar.style.width = `${currentWidth}%`;
        }, interval);
    }

    addSkillCompletionEffect(skillBar) {
        const skillItem = skillBar.closest('.skill-item');
        const skillName = skillItem.querySelector('.skill-name').textContent.toLowerCase();
        
        // Different glow colors based on skill type
        let glowColor = 'rgba(0, 212, 255, 0.6)'; // Default blockchain blue
        
        if (skillName.includes('java')) {
            glowColor = 'rgba(248, 152, 32, 0.6)';
        } else if (skillName.includes('solidity') || skillName.includes('rust')) {
            glowColor = 'rgba(124, 58, 237, 0.6)';
        } else if (skillName.includes('html') || skillName.includes('css') || skillName.includes('react')) {
            glowColor = 'rgba(16, 185, 129, 0.6)';
        }
        
        skillBar.style.boxShadow = `0 0 20px ${glowColor}`;
        setTimeout(() => {
            skillBar.style.boxShadow = '';
        }, 1000);
    }

    animateCounter(counter) {
        const targetValue = parseInt(counter.getAttribute('data-count'));
        let currentValue = 0;
        const increment = targetValue / 100;
        const duration = 2000;
        const interval = duration / 100;

        const animation = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(animation);
            }
            counter.textContent = Math.floor(currentValue);
        }, interval);
    }

    setupSkillProgressBars() {
        // Set default skill levels for your actual skills
        const skillLevels = {
            'solidity': 85,
            'rust': 70,
            'web3': 80,
            'ipfs': 75,
            'java': 95,
            'javascript': 90,
            'typescript': 80,
            'sql': 85,
            'html': 95,
            'css': 90,
            'react': 85,
            'node': 80
        };

        this.skillBars.forEach(bar => {
            const skillItem = bar.closest('.skill-item');
            const skillName = skillItem.querySelector('.skill-name').textContent.toLowerCase();
            
            // Find matching skill level
            for (const [skill, level] of Object.entries(skillLevels)) {
                if (skillName.includes(skill)) {
                    bar.setAttribute('data-skill', level);
                    const percentage = skillItem.querySelector('.skill-percentage');
                    if (percentage) {
                        percentage.textContent = `${level}%`;
                    }
                    break;
                }
            }
        });
    }

    bindSkillHover() {
        this.skillItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const skillIcon = item.querySelector('.skill-icon');
                const skillBar = item.querySelector('.skill-fill');
                
                if (skillIcon) {
                    skillIcon.style.transform = 'scale(1.1) rotate(5deg)';
                }
                
                if (skillBar) {
                    skillBar.style.transform = 'scaleY(1.2)';
                    skillBar.style.filter = 'brightness(1.3)';
                }
            });

            item.addEventListener('mouseleave', () => {
                const skillIcon = item.querySelector('.skill-icon');
                const skillBar = item.querySelector('.skill-fill');
                
                if (skillIcon) {
                    skillIcon.style.transform = 'scale(1) rotate(0deg)';
                }
                
                if (skillBar) {
                    skillBar.style.transform = 'scaleY(1)';
                    skillBar.style.filter = 'brightness(1)';
                }
            });
        });
    }

    initNetworkHover() {
        this.networkItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                // Add ripple effect
                this.addRippleEffect(item);
                
                // Animate other networks
                this.networkItems.forEach((otherItem, otherIndex) => {
                    if (otherIndex !== index) {
                        otherItem.style.transform = 'scale(0.9)';
                        otherItem.style.opacity = '0.7';
                    }
                });
            });

            item.addEventListener('mouseleave', () => {
                // Reset all networks
                this.networkItems.forEach(otherItem => {
                    otherItem.style.transform = 'scale(1)';
                    otherItem.style.opacity = '1';
                });
            });
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            margin-top: -50px;
            margin-left: -50px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===========================
// PROJECT SYSTEM
// ===========================

class ProjectSystem {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.initProjectHover();
        this.setupProjectStats();
        this.initProjectLinks();
    }

    initProjectHover() {
        this.projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addProjectHoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeProjectHoverEffect(card);
            });
        });
    }

    addProjectHoverEffect(card) {
        const stats = card.querySelectorAll('.stat');
        const techTags = card.querySelectorAll('.tech-tag');
        
        // Animate stats
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'translateY(-5px)';
                stat.style.color = 'var(--primary-color)';
            }, index * 100);
        });
        
        // Animate tech tags
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'scale(1.05)';
                tag.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
            }, index * 50);
        });
    }

    removeProjectHoverEffect(card) {
        const stats = card.querySelectorAll('.stat');
        const techTags = card.querySelectorAll('.tech-tag');
        
        stats.forEach(stat => {
            stat.style.transform = 'translateY(0)';
            stat.style.color = '';
        });
        
        techTags.forEach(tag => {
            tag.style.transform = 'scale(1)';
            tag.style.boxShadow = '';
        });
    }

    setupProjectStats() {
        // Add dynamic stats based on project type
        this.projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const statsContainer = card.querySelector('.project-stats');
            
            if (statsContainer && category) {
                this.updateProjectStats(statsContainer, category);
            }
        });
    }

    updateProjectStats(container, category) {
        const stats = container.querySelectorAll('.stat');
        stats.forEach(stat => {
            const icon = stat.querySelector('i');
            if (icon) {
                // Add animation classes based on category
                if (category === 'blockchain') {
                    icon.style.color = 'var(--primary-color)';
                } else if (category === 'java') {
                    icon.style.color = 'var(--java-orange)';
                } else if (category === 'game') {
                    icon.style.color = 'var(--success-color)';
                }
            }
        });
    }

    initProjectLinks() {
        document.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click animation
                link.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    link.style.transform = 'scale(1.2) rotate(360deg)';
                }, 100);
                
                // Analytics tracking
                this.trackProjectClick(link);
            });
        });
    }

    trackProjectClick(link) {
        const projectCard = link.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        const linkType = link.querySelector('i').classList.contains('fa-github') ? 'github' : 'demo';
        
        // Store analytics data
        const analytics = Utils.storage.get('analytics') || { projectClicks: [] };
        analytics.projectClicks.push({
            project: projectTitle,
            linkType,
            timestamp: Utils.getCurrentTimestamp(),
            userAgent: navigator.userAgent
        });
        Utils.storage.set('analytics', analytics);
        
        console.log(`Project click tracked: ${projectTitle} - ${linkType}`);
    }
}

// ===========================
// CONTACT FORM HANDLER
// ===========================

class ContactFormHandler {
    constructor() {
        this.form = DOM.contactForm;
        this.isSubmitting = false;
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true,
                minLength: 5
            },
            message: {
                required: true,
                minLength: 10
            }
        };
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.bindEvents();
        this.initRealTimeValidation();
        this.initFormAnimations();
        this.setupContactMethodCopy();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const formData = this.getFormData();
        const validation = this.validateForm(formData);
        
        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }
        
        await this.submitForm(formData);
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }

    validateForm(data) {
        const errors = {};
        let isValid = true;
        
        Object.keys(this.validationRules).forEach(field => {
            const rules = this.validationRules[field];
            const value = data[field] || '';
            
            if (rules.required && !value) {
                errors[field] = `${this.getFieldLabel(field)} is required`;
                isValid = false;
            } else if (value) {
                if (rules.minLength && value.length < rules.minLength) {
                    errors[field] = `${this.getFieldLabel(field)} must be at least ${rules.minLength} characters`;
                    isValid = false;
                }
                
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors[field] = `Please enter a valid ${this.getFieldLabel(field).toLowerCase()}`;
                    isValid = false;
                }
            }
        });
        
        return { isValid, errors };
    }

    getFieldLabel(field) {
        const labels = {
            name: 'Full Name',
            email: 'Email Address',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[field] || field;
    }

    showValidationErrors(errors) {
        // Clear previous errors
        this.clearErrors();
        
        Object.keys(errors).forEach(field => {
            const input = this.form.querySelector(`[name="${field}"]`);
            const errorMessage = errors[field];
            
            if (input) {
                input.classList.add('error');
                this.showFieldError(input, errorMessage);
            }
        });
        
        NotificationSystem.show('Please correct the errors in the form', 'error');
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            let errorElement = formGroup.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        }
    }

    clearErrors() {
        this.form.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });
        
        this.form.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    async submitForm(formData) {
        this.setSubmittingState(true);
        
        try {
            // Simulate form submission
            await this.simulateFormSubmission(formData);
            this.handleSubmissionSuccess(formData);
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleSubmissionError(error);
        } finally {
            this.setSubmittingState(false);
        }
    }

    async simulateFormSubmission(formData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Log form data
        console.log('Form submitted:', formData);
        
        // Save to local storage
        const submissions = Utils.storage.get('formSubmissions') || [];
        submissions.push({
            ...formData,
            timestamp: Utils.getCurrentTimestamp(),
            id: Date.now()
        });
        Utils.storage.set('formSubmissions', submissions);
        
        // Simulate success (90% success rate)
        if (Math.random() < 0.9) {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error('Network error'));
        }
    }

    handleSubmissionSuccess(formData) {
        NotificationSystem.show(
            `Thank you ${formData.name}! Your message has been sent successfully. I'll get back to you soon!`,
            'success',
            7000
        );
        
        this.form.reset();
        this.animateFormReset();
        
        // Track successful submission
        this.trackFormSubmission('success', formData.subject);
    }

    handleSubmissionError(error) {
        NotificationSystem.show(
            'Sorry, there was an error sending your message. Please try again or contact me directly.',
            'error',
            7000
        );
        
        this.trackFormSubmission('error', 'unknown');
    }

    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        const submitBtn = this.form.querySelector('.submit-btn');
        
        if (submitBtn) {
            if (isSubmitting) {
                submitBtn.classList.add('loading');
                submitBtn.querySelector('span').textContent = 'Sending...';
                submitBtn.disabled = true;
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('span').textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        }
    }

    initRealTimeValidation() {
        Object.keys(this.validationRules).forEach(fieldName => {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', Utils.debounce(() => this.validateField(input), 500));
            }
        });
    }

    validateField(input) {
        const fieldName = input.name;
        const value = input.value.trim();
        const rules = this.validationRules[fieldName];
        
        // Clear previous error
        input.classList.remove('error', 'success');
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup?.querySelector('.error-message');
        if (errorElement) errorElement.remove();
        
        if (!rules) return;
        
        let isValid = true;
        let errorMessage = '';
        
        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        } else if (value) {
            if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = `Must be at least ${rules.minLength} characters`;
            } else if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = `Please enter a valid ${this.getFieldLabel(fieldName).toLowerCase()}`;
            }
        }
        
        if (isValid && value) {
            input.classList.add('success');
        } else if (!isValid) {
            input.classList.add('error');
            this.showFieldError(input, errorMessage);
        }
    }

    setupContactMethodCopy() {
        document.querySelectorAll('.contact-method').forEach(method => {
            method.addEventListener('click', () => this.copyContactInfo(method));
        });
    }

    copyContactInfo(methodElement) {
        const valueElement = methodElement.querySelector('.method-value');
        if (valueElement) {
            const textToCopy = valueElement.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                NotificationSystem.show(`Copied "${textToCopy}" to clipboard!`, 'success', 3000);
                
                // Visual feedback
                methodElement.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    methodElement.style.transform = '';
                }, 150);
            }).catch(err => {
                console.error('Copy failed:', err);
                NotificationSystem.show('Failed to copy to clipboard', 'error');
            });
        }
    }

    animateFormReset() {
        const formGroups = this.form.querySelectorAll('.form-group');
        formGroups.forEach((group, index) => {
            setTimeout(() => {
                group.style.transform = 'scale(0.98)';
                group.style.opacity = '0.7';
                setTimeout(() => {
                    group.style.transform = '';
                    group.style.opacity = '';
                }, 150);
            }, index * 100);
        });
    }

    initFormAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const formGroup = input.closest('.form-group');
                formGroup?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                const formGroup = input.closest('.form-group');
                formGroup?.classList.remove('focused');
            });
        });
    }

    trackFormSubmission(status, subject) {
        const analytics = Utils.storage.get('analytics') || { formSubmissions: [] };
        analytics.formSubmissions.push({
            timestamp: Utils.getCurrentTimestamp(),
            status,
            subject,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });
        Utils.storage.set('analytics', analytics);
    }
}

// ===========================
// SCROLL ANIMATION SYSTEM
// ===========================

class ScrollAnimationSystem {
    constructor() {
        this.elements = [];
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
        this.initParallaxEffects();
        this.initScrollProgressBar();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-50px 0px -50px 0px',
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target, entry.intersectionRatio);
                }
            });
        }, observerOptions);
    }

    observeElements() {
        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('fade-in');
            this.observer.observe(section);
        });

        // Observe cards and items
        document.querySelectorAll('.project-card, .skill-item, .achievement-badge, .network-item').forEach(element => {
            element.classList.add('slide-in');
            this.observer.observe(element);
        });
    }

    animateElement(element, ratio) {
        if (element.classList.contains('animated')) return;
        
        element.classList.add('animated', 'visible');
        
        // Add staggered animation delay for child elements
        const children = element.querySelectorAll('.project-card, .skill-item, .network-item');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('visible');
            }, index * 100);
        });
    }

    initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.blockchain-avatar, .floating-crypto');
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollY * parseFloat(speed));
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10));
    }

    initScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress-bar';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--java-orange), var(--primary-color), var(--secondary-color));
            z-index: 10001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxScroll) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }, 10));
    }
}

// ===========================
// GITHUB DATA FETCHER
// ===========================

class GitHubDataFetcher {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
        this.username = 'nxtman0z'; // Updated with your username
    }

    async fetchGitHubStats() {
        const cacheKey = 'github-stats';
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }

        try {
            const response = await fetch(`https://api.github.com/users/${this.username}`);
            const userData = await response.json();
            
            const reposResponse = await fetch(`https://api.github.com/users/${this.username}/repos`);
            const reposData = await reposResponse.json();
            
            const stats = {
                publicRepos: userData.public_repos || 20,
                followers: userData.followers || 10,
                totalStars: reposData.reduce((total, repo) => total + (repo.stargazers_count || 0), 0),
                languages: this.extractLanguages(reposData),
                lastUpdated: new Date().toISOString(),
                profileViews: userData.public_repos * 15 // Estimated
            };

            this.cache.set(cacheKey, {
                data: stats,
                timestamp: Date.now()
            });

            return stats;
        } catch (error) {
            console.error('Failed to fetch GitHub stats:', error);
            // Return fallback data
            return {
                publicRepos: 20,
                followers: 10,
                totalStars: 25,
                languages: [
                    { language: 'Java', count: 8 },
                    { language: 'JavaScript', count: 6 },
                    { language: 'Solidity', count: 4 },
                    { language: 'HTML', count: 3 },
                    { language: 'CSS', count: 3 }
                ],
                lastUpdated: new Date().toISOString()
            };
        }
    }

    extractLanguages(repos) {
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        return Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([lang, count]) => ({ language: lang, count }));
    }

    async updateGitHubStats() {
        const stats = await this.fetchGitHubStats();
        
        // Update repository count
        const repoElements = document.querySelectorAll('[data-github-repos]');
        repoElements.forEach(el => {
            el.textContent = stats.publicRepos;
        });
        
        // Update follower count  
        const followerElements = document.querySelectorAll('[data-github-followers]');
        followerElements.forEach(el => {
            el.textContent = stats.followers;
        });
        
        console.log('GitHub stats updated:', stats);
        return stats;
    }
}

// ===========================
// PERFORMANCE MONITOR
// ===========================

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            renderTime: 0,
            interactionTime: 0,
            memoryUsage: 0,
            startTime: Date.now()
        };
        this.init();
    }

    init() {
        this.measureLoadTime();
        this.measureRenderTime();
        this.monitorMemoryUsage();
        this.setupPerformanceObserver();
        this.trackUserInteractions();
    }

    measureLoadTime() {
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
            this.metrics.loadTime = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        }
    }

    measureRenderTime() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        if (firstContentfulPaint) {
            this.metrics.renderTime = firstContentfulPaint.startTime;
        }
    }

    monitorMemoryUsage() {
        if ('memory' in performance) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize / (1024 * 1024); // MB
        }
    }

    trackUserInteractions() {
        let interactionCount = 0;
        const startTime = Date.now();

        ['click', 'scroll', 'keydown', 'mousemove'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
                this.metrics.interactionTime = Date.now() - startTime;
            }, { once: false, passive: true });
        });
    }

    setupPerformanceObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`Performance measure: ${entry.name} took ${entry.duration}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    logMetrics() {
        console.table({
            ...this.metrics,
            sessionDuration: `${Math.round((Date.now() - this.metrics.startTime) / 1000)}s`
        });
    }

    getMetrics() {
        return { 
            ...this.metrics,
            sessionDuration: Date.now() - this.metrics.startTime
        };
    }
}

// ===========================
// MAIN APPLICATION CONTROLLER
// ===========================

class JavaBlockchainPortfolioApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Show loading screen
            this.modules.loadingScreen = new LoadingScreen();
            
            // Wait for DOM to be fully loaded
            await this.waitForDOM();
            
            // Initialize core modules
            await this.initializeModules();
            
            // Setup global event listeners
            this.setupGlobalListeners();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('🚀 Java & Blockchain Portfolio initialized successfully!');
            
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
            NotificationSystem.show('Failed to initialize portfolio. Please refresh the page.', 'error');
        }
    }

    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async initializeModules() {
        // Initialize navigation system
        this.modules.navigation = new NavigationSystem();
        window.navigationSystem = this.modules.navigation; // Global reference
        
        // Load saved theme
        this.modules.navigation.loadSavedTheme();
        
        // Initialize role card rotation
        this.modules.roleRotation = new RoleCardRotation();
        
        // Initialize typewriter effect
        if (DOM.typewriter) {
            this.modules.typewriter = new TypewriterEffect(DOM.typewriter);
            window.typewriterEffect = this.modules.typewriter; // Global reference
        }
        
        // Initialize blockchain canvas
        if (DOM.blockchainCanvas) {
            this.modules.blockchainCanvas = new BlockchainCanvas(DOM.blockchainCanvas);
            window.blockchainCanvas = this.modules.blockchainCanvas; // Global reference
        }
        
        // Initialize matrix rain effect
        if (DOM.cryptoRain) {
            this.modules.matrixRain = new MatrixRainEffect(DOM.cryptoRain);
        }
        
        // Initialize skill animations
        this.modules.skillAnimations = new SkillAnimationSystem();
        
        // Initialize project system
        this.modules.projectSystem = new ProjectSystem();
        
        // Initialize contact form
        this.modules.contactForm = new ContactFormHandler();
        
        // Initialize scroll animations
        this.modules.scrollAnimations = new ScrollAnimationSystem();
        
        // Initialize GitHub data fetcher
        this.modules.githubFetcher = new GitHubDataFetcher();
        
        // Initialize performance monitor
        this.modules.performanceMonitor = new PerformanceMonitor();
        window.performanceMonitor = this.modules.performanceMonitor; // Global reference
        
        // Load dynamic data
        await this.loadDynamicData();
    }

    async loadDynamicData() {
        try {
            // Fetch and update GitHub stats
            if (this.modules.githubFetcher) {
                await this.modules.githubFetcher.updateGitHubStats();
            }
            
        } catch (error) {
            console.error('Failed to load dynamic data:', error);
        }
    }

    setupGlobalListeners() {
        // Handle loading complete event
        document.addEventListener('loadingComplete', () => {
            this.onLoadingComplete();
        });
        
        // Handle window unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
        
        // Handle online/offline status
        window.addEventListener('online', () => {
            NotificationSystem.show('Connection restored!', 'success');
        });
        
        window.addEventListener('offline', () => {
            NotificationSystem.show('Connection lost. Some features may not work.', 'warning');
        });

        // Add ripple animation styles
        this.addRippleStyles();
    }

    addRippleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    onLoadingComplete() {
        // Start animations that should only run after loading
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
        
        // Log performance metrics
        if (this.modules.performanceMonitor) {
            setTimeout(() => {
                this.modules.performanceMonitor.logMetrics();
            }, 2000);
        }
    }

    onPageHidden() {
        // Pause animations to save battery
        document.body.classList.add('page-hidden');
        
        // Stop expensive animations
        if (this.modules.blockchainCanvas) {
            this.modules.blockchainCanvas.destroy();
        }
        if (this.modules.matrixRain) {
            this.modules.matrixRain.destroy();
        }
    }

    onPageVisible() {
        // Resume animations
        document.body.classList.remove('page-hidden');
        
        // Restart animations
        if (this.modules.blockchainCanvas && DOM.blockchainCanvas) {
            this.modules.blockchainCanvas = new BlockchainCanvas(DOM.blockchainCanvas);
        }
        if (this.modules.matrixRain && DOM.cryptoRain) {
            this.modules.matrixRain = new MatrixRainEffect(DOM.cryptoRain);
        }
    }

    cleanup() {
        // Clean up animations and listeners
        Object.values(this.modules).forEach(module => {
            if (module && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
    }

    // Public API methods
    getModule(name) {
        return this.modules[name];
    }

    isReady() {
        return this.isInitialized;
    }
}

// ===========================
// APPLICATION INITIALIZATION
// ===========================

// Initialize the application when DOM is ready
let portfolioApp;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        portfolioApp = new JavaBlockchainPortfolioApp();
        window.portfolioApp = portfolioApp; // Global reference for debugging
        
        // Add global utilities
        window.Utils = Utils;
        window.NotificationSystem = NotificationSystem;
        
    } catch (error) {
        console.error('Critical error during initialization:', error);
        
        // Show fallback error message
        document.body.innerHTML += `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: #ef4444; color: white; padding: 2rem; border-radius: 8px; z-index: 10000;">
                <h3>Initialization Error</h3>
                <p>Failed to load the portfolio. Please refresh the page.</p>
                <button onclick="window.location.reload()" style="background: white; color: #ef4444; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                    Refresh Page
                </button>
            </div>
        `;
    }
});

// Handle errors globally
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Don't show too many error notifications
    if (!window.errorNotificationShown) {
        NotificationSystem.show('An error occurred. Some features may not work properly.', 'error');
        window.errorNotificationShown = true;
        
        // Reset error notification flag after 5 minutes
        setTimeout(() => {
            window.errorNotificationShown = false;
        }, 5 * 60 * 1000);
    }
});

// Console welcome message
console.log('%c🚀 Welcome to Manoj Kumar\'s Java & Blockchain Portfolio! 🚀', 'color: #f89820; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #f89820;');
console.log('%c☕ Built with Java expertise and Web3 innovation!', 'color: #00d4ff; font-size: 14px;');
console.log('%c👨‍💻 Developer: Manoj Kumar (@nxtman0z)', 'color: #10b981; font-size: 12px;');
console.log('%c🔗 GitHub: https://github.com/nxtman0z', 'color: #7c3aed; font-size: 12px;');

// Export for external use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { JavaBlockchainPortfolioApp, Utils, NotificationSystem };
}