/**
 * ZINARA DIGITAL - MAIN JAVASCRIPT
 * Navigation, Analytics, Core Interactions
 */

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

class Navigation {
  constructor() {
    this.nav = document.getElementById('main-nav');
    this.toggle = document.querySelector('.nav__toggle');
    this.menu = document.querySelector('.nav__menu');
    this.dropdowns = document.querySelectorAll('.nav__dropdown');
    
    this.init();
  }
  
  init() {
    // Mobile toggle
    if (this.toggle && this.menu) {
      this.toggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Dropdown functionality
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.nav__dropdown-toggle');
      const menu = dropdown.querySelector('.nav__dropdown-menu');
      
      if (toggle && menu) {
        // Desktop hover (handled by CSS)
        // Mobile click
        toggle.addEventListener('click', (e) => {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            this.toggleDropdown(dropdown);
          }
        });
      }
    });
    
    // Scroll behavior
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Close menu on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.menu.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (this.menu.classList.contains('active') && 
          !this.nav.contains(e.target)) {
        this.closeMobileMenu();
      }
    });
  }
  
  toggleMobileMenu() {
    const isExpanded = this.toggle.getAttribute('aria-expanded') === 'true';
    this.toggle.setAttribute('aria-expanded', !isExpanded);
    this.menu.classList.toggle('active');
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  }
  
  closeMobileMenu() {
    this.toggle.setAttribute('aria-expanded', 'false');
    this.menu.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  toggleDropdown(dropdown) {
    const toggle = dropdown.querySelector('.nav__dropdown-toggle');
    const menu = dropdown.querySelector('.nav__dropdown-menu');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    // Close other dropdowns
    this.dropdowns.forEach(d => {
      if (d !== dropdown) {
        d.querySelector('.nav__dropdown-toggle').setAttribute('aria-expanded', 'false');
        d.classList.remove('active');
      }
    });
    
    toggle.setAttribute('aria-expanded', !isExpanded);
    dropdown.classList.toggle('active');
  }
  
  handleScroll() {
    if (window.scrollY > 50) {
      this.nav.classList.add('scrolled');
    } else {
      this.nav.classList.remove('scrolled');
    }
  }
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

class Analytics {
  constructor() {
    this.init();
  }
  
  init() {
    // Initialize dataLayer if not exists
    window.dataLayer = window.dataLayer || [];
    
    // Track page view
    this.trackPageView();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  trackPageView() {
    window.dataLayer.push({
      'event': 'page_view',
      'page_type': this.getPageType(),
      'page_title': document.title,
      'page_url': window.location.href,
      'timestamp': new Date().toISOString()
    });
  }
  
  getPageType() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.includes('digital-marketing')) return 'layer_1';
    if (path.includes('ai-training')) return 'layer_2';
    if (path.includes('revenue-infrastructure')) return 'layer_3';
    if (path.includes('revenue-audit')) return 'audit';
    if (path.includes('insights')) return 'blog';
    return 'other';
  }
  
  setupEventListeners() {
    // Track all links with data-track attribute
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-track]');
      if (link) {
        this.trackLinkClick(link);
      }
    });
  }
  
  trackLinkClick(link) {
    const trackType = link.getAttribute('data-track');
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    
    window.dataLayer.push({
      'event': 'link_click',
      'link_type': trackType,
      'link_url': href,
      'link_text': text,
      'timestamp': new Date().toISOString()
    });
  }
}

// Global CTA tracking function (used in HTML onclick)
function trackCTAClick(ctaText, ctaUrl, ctaLocation) {
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      'event': 'cta_click',
      'cta_text': ctaText,
      'cta_url': ctaUrl,
      'cta_location': ctaLocation,
      'timestamp': new Date().toISOString()
    });
  }
  
  // Also track in Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cta_click', {
      'event_category': 'cta',
      'event_label': ctaText,
      'cta_location': ctaLocation
    });
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

class SmoothScroll {
  constructor() {
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, href);
          }
        }
      });
    });
  }
}

// ============================================
// ACCORDION FUNCTIONALITY (for sublayer items)
// ============================================

class Accordion {
  constructor(selector) {
    this.accordions = document.querySelectorAll(selector);
    this.init();
  }
  
  init() {
    this.accordions.forEach(accordion => {
      const header = accordion.querySelector('.sublayer-item__header');
      if (header) {
        header.addEventListener('click', () => this.toggle(header));
      }
    });
  }
  
  toggle(header) {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    // Close all other accordions
    this.accordions.forEach(accordion => {
      const otherHeader = accordion.querySelector('.sublayer-item__header');
      if (otherHeader !== header) {
        otherHeader.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toggle current
    header.setAttribute('aria-expanded', !isExpanded);
    
    // Track analytics
    if (!isExpanded && typeof window.dataLayer !== 'undefined') {
      const title = header.querySelector('.sublayer-item__title').textContent;
      window.dataLayer.push({
        'event': 'accordion_opened',
        'accordion_title': title,
        'timestamp': new Date().toISOString()
      });
    }
  }
}

// ============================================
// INTERSECTION OBSERVER (for animations on scroll)
// ============================================

class AnimateOnScroll {
  constructor() {
    this.init();
  }
  
  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      return;
    }
    
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    // Observe elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }
}

// ============================================
// FORM HANDLING
// ============================================

class FormHandler {
  constructor(selector) {
    this.forms = document.querySelectorAll(selector);
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  }
  
  async handleSubmit(e, form) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Track form submission
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'form_submit',
        'form_name': form.getAttribute('data-form-name') || 'unknown',
        'form_data': data,
        'timestamp': new Date().toISOString()
      });
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      // Simulate API call (replace with actual endpoint)
      try {
        // await fetch('/api/submit-form', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });
        
        // For demo: simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Success
        this.showSuccess(form);
      } catch (error) {
        this.showError(form, error.message);
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  }
  
  showSuccess(form) {
    const message = document.createElement('div');
    message.className = 'form-message form-message--success';
    message.textContent = 'Thank you! We\'ll be in touch shortly.';
    form.insertAdjacentElement('afterend', message);
    form.reset();
    
    setTimeout(() => message.remove(), 5000);
  }
  
  showError(form, errorMsg) {
    const message = document.createElement('div');
    message.className = 'form-message form-message--error';
    message.textContent = `Error: ${errorMsg}. Please try again.`;
    form.insertAdjacentElement('afterend', message);
    
    setTimeout(() => message.remove(), 5000);
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

class LazyLoadImages {
  constructor() {
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

// ============================================
// COOKIE CONSENT
// ============================================

class CookieConsent {
  constructor() {
    this.banner = null;
    this.init();
  }
  
  init() {
    // Check if user has already consented
    if (this.hasConsented()) {
      return;
    }
    
    this.createBanner();
    this.showBanner();
  }
  
  hasConsented() {
    return localStorage.getItem('zinara_cookie_consent') === 'true';
  }
  
  createBanner() {
    this.banner = document.createElement('div');
    this.banner.className = 'cookie-banner';
    this.banner.innerHTML = `
      <div class="cookie-banner__content">
        <p class="cookie-banner__text">
          This site uses cookies to improve your experience and analyze performance. 
          <a href="/privacy-policy.html" class="cookie-banner__link">Learn more</a>
        </p>
        <div class="cookie-banner__actions">
          <button class="btn btn--secondary btn--small" data-action="customize">Customize</button>
          <button class="btn btn--primary btn--small" data-action="accept">Accept All</button>
        </div>
      </div>
    `;
    
    this.banner.querySelector('[data-action="accept"]').addEventListener('click', () => {
      this.acceptAll();
    });
    
    this.banner.querySelector('[data-action="customize"]').addEventListener('click', () => {
      window.location.href = '/cookie-policy.html';
    });
  }
  
  showBanner() {
    document.body.appendChild(this.banner);
    setTimeout(() => this.banner.classList.add('show'), 100);
  }
  
  acceptAll() {
    localStorage.setItem('zinara_cookie_consent', 'true');
    this.banner.classList.remove('show');
    setTimeout(() => this.banner.remove(), 300);
    
    // Track consent
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'cookie_consent',
        'consent_type': 'all',
        'timestamp': new Date().toISOString()
      });
    }
  }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new Navigation();
  new Analytics();
  new SmoothScroll();
  new LazyLoadImages();
  new CookieConsent();
  
  // Conditional initialization
  if (document.querySelector('.sublayer-item')) {
    new Accordion('.sublayer-item');
  }
  
  if (document.querySelector('form')) {
    new FormHandler('form');
  }
  
  if (document.querySelector('[data-animate]')) {
    new AnimateOnScroll();
  }
  
  // Make trackCTAClick available globally
  window.trackCTAClick = trackCTAClick;
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Navigation,
    Analytics,
    SmoothScroll,
    Accordion,
    FormHandler
  };
}
