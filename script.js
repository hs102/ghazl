/* =====================================================
   GHAZL - Landing Page JavaScript
   Premium animations and interactions with GSAP
   ===================================================== */

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // Initialize all modules
    initLoader();
    initCursor();
    initNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initProcessTimeline();
    initCounterAnimations();
    initContactForm();
    initMagneticButtons();
});

/* ----- Smooth Scroll with Lenis ----- */
let lenis;

function initSmoothScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
    
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5
                });
            }
        });
    });
}

/* ----- Loader ----- */
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.6,
            delay: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                
                // Trigger hero animations after loader
                animateHero();
            }
        });
    });
}

/* ----- Custom Cursor ----- */
function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    
    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        // Dot follows immediately
        dotX += (mouseX - dotX) * 0.5;
        dotY += (mouseY - dotY) * 0.5;
        
        // Ring follows with delay
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        
        dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .product-card, .problem-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

/* ----- Navigation ----- */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
            if (self.scroll() > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });
    
    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            lenis.start();
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                if (window.scrollY >= sectionTop) {
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
    });
}

/* ----- Hero Animations ----- */
function initHeroAnimations() {
    // Set initial states
    gsap.set('.hero-badge', { opacity: 0, y: 30 });
    gsap.set('.hero-title .title-line', { opacity: 0, y: 50 });
    gsap.set('.hero-description', { opacity: 0, y: 30 });
    gsap.set('.hero-actions', { opacity: 0, y: 30 });
    gsap.set('.hero-scroll', { opacity: 0 });
    gsap.set('.hero-stats', { opacity: 0, x: 30 });
}

function animateHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8 })
      .to('.hero-title .title-line', { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          stagger: 0.2 
      }, '-=0.4')
      .to('.hero-description', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
      .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
      .to('.hero-scroll', { opacity: 1, duration: 0.8 }, '-=0.2')
      .to('.hero-stats', { opacity: 1, x: 0, duration: 0.8 }, '-=0.6');
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Problem cards
    gsap.utils.toArray('.problem-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out'
        });
    });
    
    // Story solution
    gsap.from('.visual-wrapper', {
        scrollTrigger: {
            trigger: '.story-solution',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.solution-content', {
        scrollTrigger: {
            trigger: '.story-solution',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 60,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });
    
    // Product cards
    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: (i % 3) * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Impact stats
    gsap.utils.toArray('.impact-stat').forEach((stat, i) => {
        gsap.from(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 40,
            scale: 0.95,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out'
        });
    });
    
    // Quote
    gsap.from('.impact-quote', {
        scrollTrigger: {
            trigger: '.impact-quote',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Contact section
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -40,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 40,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out'
    });
}

/* ----- Process Timeline ----- */
function initProcessTimeline() {
    const steps = gsap.utils.toArray('.process-step');
    const progressBar = document.getElementById('timelineProgress');
    
    // Animate steps on scroll
    steps.forEach((step, i) => {
        gsap.to(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
                onEnter: () => step.classList.add('active'),
                onLeaveBack: () => step.classList.remove('active')
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
    
    // Progress bar
    ScrollTrigger.create({
        trigger: '.process-timeline',
        start: 'top 60%',
        end: 'bottom 40%',
        onUpdate: (self) => {
            gsap.to(progressBar, {
                height: `${self.progress * 100}%`,
                duration: 0.1,
                ease: 'none'
            });
        }
    });
}

/* ----- Counter Animations ----- */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'), 10);
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        counter.textContent = Math.round(this.targets()[0].innerText);
                    }
                });
            }
        });
    });
}

/* ----- Contact Form ----- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        
        // Loading state
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
        
        // Simulate submission
        await new Promise(r => setTimeout(r, 1500));
        
        // Success state
        btn.innerHTML = '<span>Message Sent!</span><i data-lucide="check"></i>';
        btn.style.background = 'var(--cyan)';
        lucide.createIcons();
        
        form.reset();
        
        // Reset button
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.style.background = '';
            lucide.createIcons();
        }, 3000);
    });
}

/* ----- Magnetic Buttons ----- */
function initMagneticButtons() {
    if (!window.matchMedia('(hover: hover)').matches) return;
    
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

/* ----- Parallax Effects ----- */
ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => {
        gsap.set('.hero-content', {
            y: self.progress * 100,
            opacity: 1 - self.progress * 0.5
        });
    }
});

/* ----- Resize Handler ----- */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
