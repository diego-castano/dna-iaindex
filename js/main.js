/* ===== MAIN APPLICATION ===== */
class AIIndexingApp {
  constructor() {
    this.sections = [];
    this.links = [];
    this.progressBar = null;
    this.currentActiveSection = null;
    this.scrollTimeout = null;
    this.lenis = null;
    
    this.init();
  }
  
  init() {
    this.initLenis();
    this.initElements();
    this.initScrollSpy();
    this.initAnimations();
    this.initMobileDrawer();
    this.initProgressBar();
  }
  
  /* ===== LENIS SMOOTH SCROLL ===== */
  initLenis() {
    const initLenis = () => {
      try {
        if (typeof Lenis !== 'undefined') {
          this.lenis = new Lenis({ 
            smoothWheel: true, 
            lerp: 0.12 
          });
          
          const raf = (time) => { 
            if (this.lenis) this.lenis.raf(time); 
            requestAnimationFrame(raf); 
          };
          requestAnimationFrame(raf);
          
          console.log('Lenis initialized successfully');
        } else {
          setTimeout(initLenis, 100);
        }
      } catch (error) {
        console.warn('Lenis initialization failed:', error);
        setTimeout(initLenis, 200);
      }
    };
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLenis);
    } else {
      initLenis();
    }
    
    // Fallback smooth scroll if Lenis fails
    if (!window.lenis) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  }
  
  /* ===== ELEMENT INITIALIZATION ===== */
  initElements() {
    this.sections = Array.from(document.querySelectorAll('main section[id]'));
    this.links = Array.from(document.querySelectorAll('.rail__links a'));
    this.progressBar = document.getElementById('progressBar');
    
    console.log(`Initialized ${this.sections.length} sections and ${this.links.length} links`);
  }
  
  /* ===== SCROLL SPY ===== */
  initScrollSpy() {
    // Smooth scroll-spy with debouncing
    this.updateActiveSection();
    
    // Debounced scroll handler for smooth updates
    const handleScroll = () => {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => this.updateActiveSection(), 150);
    };
    
    document.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  updateActiveSection() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Find the section that's most visible in the viewport
    let activeSection = null;
    let maxVisibility = 0;
    
    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      
      // Calculate how much of the section is visible
      const visibleTop = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const visibility = visibleTop / sectionHeight;
      
      if (visibility > maxVisibility && rect.top <= windowHeight * 0.4) {
        maxVisibility = visibility;
        activeSection = section;
      }
    });
    
    // Only update if the active section has changed
    if (activeSection && activeSection.id !== this.currentActiveSection) {
      this.currentActiveSection = activeSection.id;
      
      // Remove active class from all links
      this.links.forEach(a => a.classList.remove('active'));
      
      // Add active class to current section link
      const activeLink = this.links.find(a => a.getAttribute('href') === `#${activeSection.id}`);
      if (activeLink) {
        activeLink.classList.add('active');
        console.log('Active section changed to:', activeSection.id);
      }
    }
  }
  
  /* ===== ANIMATIONS ===== */
  initAnimations() {
    // Intersection Observer for animations only (not for scroll-spy)
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
        }
      });
    }, { 
      rootMargin: "0px 0px -20% 0px", 
      threshold: 0.1 
    });
    
    // Observe all sections for animations
    this.sections.forEach(s => { 
      io.observe(s); 
    });
    
    // Reveal on enter - more subtle
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-in'); 
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
    
    document.querySelectorAll('.obs').forEach(el => {
      revealObs.observe(el);
      el.classList.add('is-in');
    });
  }
  
  /* ===== MOBILE DRAWER ===== */
  initMobileDrawer() {
    const btnMenu = document.getElementById('btnMenu');
    const drawer = document.getElementById('mobileMenu');
    
    if (btnMenu && drawer) {
      btnMenu.addEventListener('click', () => {
        const open = drawer.getAttribute('aria-hidden') === 'false';
        drawer.setAttribute('aria-hidden', open ? 'true' : 'false');
        btnMenu.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          drawer.setAttribute('aria-hidden', 'true');
          btnMenu.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }
  
  /* ===== PROGRESS BAR ===== */
  initProgressBar() {
    if (this.progressBar) {
      const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const p = Math.min(1, Math.max(0, scrollTop / docHeight));
        this.progressBar.style.width = (p * 100) + '%';
      };
      
      document.addEventListener('scroll', onScroll, { passive: true });
    }
  }
}

/* ===== ICON HYDRATION ===== */
function hydrateIcons() {
  const map = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/></svg>',
    "layout-dashboard": '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
    "file-text": '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
    "book-text": '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/><path d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15"/><path d="M8 6h9"/><path d="M8 10h9"/></svg>',
    "pen-tool": '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-6-6 2-2 6 6-2 2z"/><path d="M2 7l4-4 5 5-4 4L2 7z"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="3"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l1.9 5.7L20 11l-6.1 2.3L12 19l-1.9-5.7L4 11l6.1-2.3L12 3z"/><path d="M5 3l.8 2.5L8 6l-2.2.5L5 9l-.8-2.5L2 6l2.2-.5L5 3z"/><path d="M19 14l.8 2.5L22 17l-2.2.5L19 20l-.8-2.5L16 17l2.2-.5 0 0L19 14z"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.37 1.77.73 2.58a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.5-1.25a2 2 0 0 1 2.11-.45c.81.36 1.68.61 2.58.73A2 2 0 0 1 22 16.92z"/></svg>'
  };
  
  document.querySelectorAll('[data-ic]').forEach(el => {
    el.innerHTML = map[el.dataset.ic] || '';
  });
}

/* ===== INITIALIZE APP ===== */
document.addEventListener('DOMContentLoaded', () => {
  hydrateIcons();
  new AIIndexingApp();
});