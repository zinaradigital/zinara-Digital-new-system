/**
 * ZINARA DIGITAL - ANALYTICS TRACKING
 * Google Analytics 4 & GTM Integration
 */

// ============================================
// INITIALIZE GOOGLE ANALYTICS 4
// ============================================

(function() {
  'use strict';
  
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Configure GA4
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': false, // We'll handle this manually
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure',
    'user_properties': {
      'user_location': 'Kenya', // Can be dynamic based on IP
      'visitor_type': getVisitorType()
    }
  });
  
  // ============================================
  // PAGE VIEW TRACKING
  // ============================================
  
  function trackPageView() {
    const pageData = {
      'event': 'page_view',
      'page_type': getPageType(),
      'page_title': document.title,
      'page_url': window.location.href,
      'page_path': window.location.pathname,
      'referrer': document.referrer,
      'timestamp': new Date().toISOString()
    };
    
    // Push to dataLayer
    window.dataLayer.push(pageData);
    
    // Send to GA4
    gtag('event', 'page_view', {
      page_title: pageData.page_title,
      page_location: pageData.page_url,
      page_path: pageData.page_path
    });
    
    // Track time on page
    trackTimeOnPage();
  }
  
  // ============================================
  // SCROLL DEPTH TRACKING
  // ============================================
  
  function trackScrollDepth() {
    const scrollDepths = [25, 50, 75, 90, 100];
    const tracked = {};
    
    window.addEventListener('scroll', throttle(() => {
      const scrollPercentage = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );
      
      scrollDepths.forEach(depth => {
        if (scrollPercentage >= depth && !tracked[depth]) {
          tracked[depth] = true;
          
          window.dataLayer.push({
            'event': 'scroll_depth',
            'scroll_percentage': depth,
            'page_type': getPageType(),
            'timestamp': new Date().toISOString()
          });
          
          gtag('event', 'scroll', {
            'event_category': 'engagement',
            'event_label': `${depth}%`,
            'value': depth
          });
        }
      });
    }, 500));
  }
  
  // ============================================
  // TIME ON PAGE TRACKING
  // ============================================
  
  function trackTimeOnPage() {
    const startTime = Date.now();
    const intervals = [30, 60, 120, 300]; // seconds
    const tracked = {};
    
    intervals.forEach(interval => {
      setTimeout(() => {
        if (!tracked[interval]) {
          tracked[interval] = true;
          
          window.dataLayer.push({
            'event': 'time_on_page',
            'duration_seconds': interval,
            'page_type': getPageType(),
            'timestamp': new Date().toISOString()
          });
          
          gtag('event', 'time_on_page', {
            'event_category': 'engagement',
            'event_label': `${interval}s`,
            'value': interval
          });
        }
      }, interval * 1000);
    });
    
    // Track total time on unload
    window.addEventListener('beforeunload', () => {
      const totalTime = Math.round((Date.now() - startTime) / 1000);
      
      window.dataLayer.push({
        'event': 'page_exit',
        'total_time_seconds': totalTime,
        'page_type': getPageType(),
        'timestamp': new Date().toISOString()
      });
    });
  }
  
  // ============================================
  // LINK CLICK TRACKING
  // ============================================
  
  function trackLinkClicks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      const text = link.textContent.trim();
      const isExternal = href && (href.startsWith('http') && !href.includes(window.location.hostname));
      const isDownload = href && /\.(pdf|doc|docx|xls|xlsx|zip|csv)$/i.test(href);
      
      if (isExternal) {
        trackOutboundLink(href, text);
      } else if (isDownload) {
        trackDownload(href, text);
      } else if (link.classList.contains('nav__link') || link.classList.contains('footer__link')) {
        trackNavigationClick(href, text, link.classList.contains('nav__link') ? 'main_nav' : 'footer');
      }
    });
  }
  
  function trackOutboundLink(url, text) {
    window.dataLayer.push({
      'event': 'outbound_link_click',
      'link_url': url,
      'link_text': text,
      'timestamp': new Date().toISOString()
    });
    
    gtag('event', 'click', {
      'event_category': 'outbound_link',
      'event_label': url,
      'link_text': text
    });
  }
  
  function trackDownload(url, text) {
    const fileExtension = url.split('.').pop().toLowerCase();
    
    window.dataLayer.push({
      'event': 'file_download',
      'file_url': url,
      'file_name': text,
      'file_extension': fileExtension,
      'timestamp': new Date().toISOString()
    });
    
    gtag('event', 'file_download', {
      'event_category': 'downloads',
      'event_label': url,
      'file_extension': fileExtension
    });
  }
  
  function trackNavigationClick(url, text, location) {
    window.dataLayer.push({
      'event': 'navigation_click',
      'nav_url': url,
      'nav_text': text,
      'nav_location': location,
      'timestamp': new Date().toISOString()
    });
    
    gtag('event', 'navigation_click', {
      'event_category': 'navigation',
      'event_label': text,
      'nav_location': location
    });
  }
  
  // ============================================
  // FORM TRACKING
  // ============================================
  
  function trackFormInteractions() {
    // Track form starts
    document.querySelectorAll('form').forEach(form => {
      let formStarted = false;
      
      form.addEventListener('focusin', () => {
        if (!formStarted) {
          formStarted = true;
          const formName = form.getAttribute('data-form-name') || form.id || 'unknown';
          
          window.dataLayer.push({
            'event': 'form_start',
            'form_name': formName,
            'timestamp': new Date().toISOString()
          });
          
          gtag('event', 'form_start', {
            'event_category': 'forms',
            'event_label': formName
          });
        }
      });
      
      // Form submission tracked in main.js FormHandler
    });
    
    // Track form field interactions
    document.querySelectorAll('form input, form textarea, form select').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.value) {
          const formName = field.closest('form')?.getAttribute('data-form-name') || 'unknown';
          const fieldName = field.getAttribute('name') || field.id;
          
          window.dataLayer.push({
            'event': 'form_field_complete',
            'form_name': formName,
            'field_name': fieldName,
            'timestamp': new Date().toISOString()
          });
        }
      });
    });
  }
  
  // ============================================
  // VIDEO TRACKING (if videos exist)
  // ============================================
  
  function trackVideoInteractions() {
    document.querySelectorAll('video').forEach(video => {
      let tracked25 = false, tracked50 = false, tracked75 = false, tracked100 = false;
      
      video.addEventListener('play', () => {
        window.dataLayer.push({
          'event': 'video_play',
          'video_src': video.src || video.querySelector('source')?.src,
          'timestamp': new Date().toISOString()
        });
      });
      
      video.addEventListener('pause', () => {
        window.dataLayer.push({
          'event': 'video_pause',
          'video_src': video.src || video.querySelector('source')?.src,
          'video_progress': Math.round((video.currentTime / video.duration) * 100),
          'timestamp': new Date().toISOString()
        });
      });
      
      video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        
        if (progress >= 25 && !tracked25) {
          tracked25 = true;
          trackVideoProgress(video, 25);
        } else if (progress >= 50 && !tracked50) {
          tracked50 = true;
          trackVideoProgress(video, 50);
        } else if (progress >= 75 && !tracked75) {
          tracked75 = true;
          trackVideoProgress(video, 75);
        } else if (progress >= 99 && !tracked100) {
          tracked100 = true;
          trackVideoProgress(video, 100);
        }
      });
    });
  }
  
  function trackVideoProgress(video, percentage) {
    window.dataLayer.push({
      'event': 'video_progress',
      'video_src': video.src || video.querySelector('source')?.src,
      'video_progress': percentage,
      'timestamp': new Date().toISOString()
    });
    
    gtag('event', 'video_progress', {
      'event_category': 'videos',
      'event_label': `${percentage}%`,
      'value': percentage
    });
  }
  
  // ============================================
  // SEARCH TRACKING (if search exists)
  // ============================================
  
  function trackSearch() {
    const searchForm = document.querySelector('form[role="search"]');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        const searchInput = searchForm.querySelector('input[type="search"]');
        if (searchInput) {
          const query = searchInput.value.trim();
          
          window.dataLayer.push({
            'event': 'search',
            'search_term': query,
            'timestamp': new Date().toISOString()
          });
          
          gtag('event', 'search', {
            'search_term': query
          });
        }
      });
    }
  }
  
  // ============================================
  // ERROR TRACKING
  // ============================================
  
  function trackErrors() {
    window.addEventListener('error', (e) => {
      window.dataLayer.push({
        'event': 'javascript_error',
        'error_message': e.message,
        'error_url': e.filename,
        'error_line': e.lineno,
        'timestamp': new Date().toISOString()
      });
      
      gtag('event', 'exception', {
        'description': e.message,
        'fatal': false
      });
    });
  }
  
  // ============================================
  // CUSTOM EVENT TRACKING
  // ============================================
  
  // Layer card clicks (homepage)
  function trackLayerCardClicks() {
    document.querySelectorAll('.layer-card').forEach(card => {
      card.addEventListener('click', () => {
        const layerNumber = card.querySelector('.layer-card__badge')?.textContent;
        const layerTitle = card.querySelector('.layer-card__title')?.textContent;
        
        window.dataLayer.push({
          'event': 'layer_card_click',
          'layer_number': layerNumber,
          'layer_title': layerTitle,
          'timestamp': new Date().toISOString()
        });
        
        gtag('event', 'layer_card_click', {
          'event_category': 'engagement',
          'event_label': layerTitle,
          'layer_number': layerNumber
        });
      });
    });
  }
  
  // Pricing tier interactions (already in workflow-animation.js, but redundancy is ok)
  function trackPricingInteractions() {
    document.querySelectorAll('.pricing-tier').forEach(tier => {
      const tierName = tier.querySelector('.tier__name')?.textContent;
      
      tier.addEventListener('mouseenter', () => {
        window.dataLayer.push({
          'event': 'pricing_tier_view',
          'tier_name': tierName,
          'timestamp': new Date().toISOString()
        });
      });
      
      const ctaButton = tier.querySelector('.btn');
      if (ctaButton) {
        ctaButton.addEventListener('click', () => {
          window.dataLayer.push({
            'event': 'pricing_tier_select',
            'tier_name': tierName,
            'timestamp': new Date().toISOString()
          });
          
          gtag('event', 'select_item', {
            'item_list_id': 'pricing_tiers',
            'item_list_name': 'Pricing Tiers',
            'items': [{
              'item_id': tierName.toLowerCase().replace(/\s+/g, '_'),
              'item_name': tierName
            }]
          });
        });
      }
    });
  }
  
  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  function getPageType() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.includes('digital-marketing')) return 'layer_1';
    if (path.includes('ai-training')) return 'layer_2';
    if (path.includes('revenue-infrastructure')) return 'layer_3';
    if (path.includes('revenue-audit')) return 'audit';
    if (path.includes('insights')) return 'blog';
    if (path.includes('contact')) return 'contact';
    if (path.includes('system')) return 'system_overview';
    return 'other';
  }
  
  function getVisitorType() {
    // Check if returning visitor
    const returningVisitor = localStorage.getItem('zinara_returning_visitor');
    if (returningVisitor) {
      return 'returning';
    } else {
      localStorage.setItem('zinara_returning_visitor', 'true');
      return 'new';
    }
  }
  
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
  
  // ============================================
  // ECOMMERCE TRACKING (Enhanced for B2B)
  // ============================================
  
  function trackAuditRequest(tierName = 'Standard') {
    gtag('event', 'begin_checkout', {
      'event_category': 'ecommerce',
      'items': [{
        'item_id': 'revenue_audit',
        'item_name': 'Revenue Recovery Audit',
        'item_category': 'Diagnostic Services',
        'item_variant': tierName,
        'price': 0, // Free audit
        'quantity': 1
      }]
    });
    
    window.dataLayer.push({
      'event': 'audit_request_started',
      'tier_name': tierName,
      'timestamp': new Date().toISOString()
    });
  }
  
  function trackAuditCompletion(tierName, email) {
    gtag('event', 'purchase', {
      'transaction_id': 'AUDIT_' + Date.now(),
      'value': 0, // Lead value can be set in GA4
      'currency': 'KES',
      'items': [{
        'item_id': 'revenue_audit',
        'item_name': 'Revenue Recovery Audit',
        'item_category': 'Diagnostic Services',
        'item_variant': tierName,
        'price': 0,
        'quantity': 1
      }]
    });
    
    window.dataLayer.push({
      'event': 'lead_generated',
      'lead_type': 'audit_request',
      'tier_name': tierName,
      'lead_email': email,
      'lead_value': 10000, // KSh 10,000 estimated value
      'timestamp': new Date().toISOString()
    });
  }
  
  // Make tracking functions available globally
  window.trackAuditRequest = trackAuditRequest;
  window.trackAuditCompletion = trackAuditCompletion;
  
  // ============================================
  // INITIALIZE ALL TRACKING
  // ============================================
  
  document.addEventListener('DOMContentLoaded', () => {
    trackPageView();
    trackScrollDepth();
    trackLinkClicks();
    trackFormInteractions();
    trackVideoInteractions();
    trackSearch();
    trackErrors();
    trackLayerCardClicks();
    trackPricingInteractions();
  });
  
})();
