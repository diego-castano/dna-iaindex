/* ===== GSAP ANIMATIONS ===== */
class GSAPAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    this.initScrollTrigger();
    this.initHeroAnimations();
    this.initStaggerAnimations();
  }
  
  /* ===== SCROLL TRIGGER INITIALIZATION ===== */
  initScrollTrigger() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      console.log('GSAP ScrollTrigger initialized');
    } else {
      console.warn('GSAP or ScrollTrigger not available');
      setTimeout(() => this.initScrollTrigger(), 500);
    }
  }
  
  /* ===== HERO ANIMATIONS ===== */
  initHeroAnimations() {
    if (typeof gsap !== 'undefined') {
      // Hero blob floating animation
      gsap.to('.hero-art .blob', {
        y: 20,
        rotation: 360,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }
  
  /* ===== STAGGER ANIMATIONS ===== */
  initStaggerAnimations() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      // KPI numbers stagger animation
      gsap.from('.kpi__num', {
        scale: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.kpi-grid',
          start: 'top 80%'
        }
      });
      
      // Subcards stagger animation
      gsap.from('.subcard', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.subgrid',
          start: 'top 80%'
        }
      });
      
      // Benefits cards stagger animation
      gsap.from('.benefits article', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.benefits',
          start: 'top 80%'
        }
      });
      
      // Timeline items stagger animation
      gsap.from('.timeline li', {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 80%'
        }
      });
    }
  }
  
  /* ===== PERFORMANCE OPTIMIZATION ===== */
  optimizeAnimations() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.hero-art .blob', { animation: 'none' });
      gsap.set('[data-gsap]', { clearProps: 'all' });
    }
  }
}

/* ===== INITIALIZE ANIMATIONS ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Wait for GSAP to load
  const checkGSAP = () => {
    if (typeof gsap !== 'undefined') {
      new GSAPAnimations();
    } else {
      setTimeout(checkGSAP, 100);
    }
  };
  
  checkGSAP();
});