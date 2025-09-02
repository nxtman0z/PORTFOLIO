class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);
        
        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'cursor-trail';
        document.body.appendChild(this.cursorTrail);
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                this.cursorTrail.style.left = e.clientX + 'px';
                this.cursorTrail.style.top = e.clientY + 'px';
            }, 100);
        });

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('cursor-hover'));
        });
    }
}
