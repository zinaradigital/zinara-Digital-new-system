/**
 * ZINARA DIGITAL - WORKFLOW ANIMATION
 * Revenue Infrastructure Page Animations
 */

class WorkflowAnimation {
  constructor() {
    this.diagram = document.querySelector('.workflow-diagram');
    this.playButton = document.getElementById('workflow-play');
    this.stages = document.querySelectorAll('.workflow-stage');
    this.connectors = document.querySelectorAll('.workflow-connector');
    this.isPlaying = false;
    
    this.init();
  }
  
  init() {
    if (!this.diagram) return;
    
    // Set up play button
    if (this.playButton) {
      this.playButton.addEventListener('click', () => this.play());
    }
    
    // Auto-play on first view
    this.observeInView();
    
    // Restart SVG animations when they end
    this.setupSVGAnimationLoop();
  }
  
  observeInView() {
    if (!('IntersectionObserver' in window)) {
      this.play();
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isPlaying) {
          this.play();
          observer.unobserve(this.diagram);
        }
      });
    }, {
      threshold: 0.3
    });
    
    observer.observe(this.diagram);
  }
  
  play() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    
    // Reset all stages
    this.stages.forEach((stage, index) => {
      stage.style.opacity = '0';
      stage.style.transform = 'translateY(20px)';
    });
    
    // Animate stages sequentially
    this.animateStages();
    
    // Restart SVG line animations
    this.restartSVGAnimations();
    
    // Track animation play
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'workflow_animation_played',
        'timestamp': new Date().toISOString()
      });
    }
    
    // Allow replay after animation completes
    setTimeout(() => {
      this.isPlaying = false;
    }, 4000);
  }
  
  animateStages() {
    const delays = [200, 800, 1400, 2000];
    
    this.stages.forEach((stage, index) => {
      setTimeout(() => {
        stage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        stage.style.opacity = '1';
        stage.style.transform = 'translateY(0)';
        
        // Activate process step for stage 2
        if (index === 1) {
          const processSteps = stage.querySelectorAll('.process-step');
          processSteps.forEach((step, stepIndex) => {
            setTimeout(() => {
              processSteps.forEach(s => s.classList.remove('active'));
              step.classList.add('active');
            }, stepIndex * 500);
          });
        }
      }, delays[index]);
    });
  }
  
  setupSVGAnimationLoop() {
    const svgLines = document.querySelectorAll('.connector-line line');
    
    svgLines.forEach((line, index) => {
      const animation = line.querySelector('animate');
      if (animation) {
        // Loop animation
        animation.addEventListener('end', () => {
          setTimeout(() => {
            animation.beginElement();
          }, 500);
        });
      }
    });
  }
  
  restartSVGAnimations() {
    const svgLines = document.querySelectorAll('.connector-line line animate');
    svgLines.forEach(animation => {
      animation.beginElement();
    });
  }
}

// ============================================
// DATA PULSE ANIMATION
// ============================================

class DataPulseAnimation {
  constructor() {
    this.pulses = document.querySelectorAll('.data-pulse');
    this.init();
  }
  
  init() {
    // Data pulses are handled by CSS animation
    // This class is for future enhancements
    
    // Add staggered delays for visual interest
    this.pulses.forEach((pulse, index) => {
      pulse.style.animationDelay = `${index * 0.3}s`;
    });
  }
}

// ============================================
// INTERACTIVE STAGE HOVER
// ============================================

class StageInteractivity {
  constructor() {
    this.stages = document.querySelectorAll('.workflow-stage');
    this.init();
  }
  
  init() {
    this.stages.forEach(stage => {
      stage.addEventListener('mouseenter', () => this.highlightStage(stage));
      stage.addEventListener('mouseleave', () => this.unhighlightStage(stage));
    });
  }
  
  highlightStage(stage) {
    const stageNumber = stage.getAttribute('data-stage');
    
    // Dim other stages
    this.stages.forEach(s => {
      if (s !== stage) {
        s.style.opacity = '0.5';
      }
    });
    
    // Track hover event
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'workflow_stage_hover',
        'stage_number': stageNumber,
        'timestamp': new Date().toISOString()
      });
    }
  }
  
  unhighlightStage(stage) {
    // Restore opacity
    this.stages.forEach(s => {
      s.style.opacity = '1';
    });
  }
}

// ============================================
// SUBLAYER COMPONENT INTERACTIONS
// ============================================

class ComponentCardInteractions {
  constructor() {
    this.cards = document.querySelectorAll('.component-card');
    this.init();
  }
  
  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => this.animateIcon(card));
    });
  }
  
  animateIcon(card) {
    const icon = card.querySelector('.component-card__icon svg');
    if (icon) {
      // Add subtle rotation animation
      icon.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      icon.style.transform = 'scale(1.1) rotate(5deg)';
      
      setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }, 500);
    }
  }
}

// ============================================
// VISUAL DEMO INTERACTIONS
// ============================================

class VisualDemoAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    this.animateCRMPipeline();
    this.animateWorkflowDemo();
    this.animateRoutingDemo();
    this.animateDashboardMetrics();
  }
  
  animateCRMPipeline() {
    const pipeline = document.querySelector('.crm-pipeline-demo');
    if (!pipeline) return;
    
    const dealCards = pipeline.querySelectorAll('.deal-card');
    
    // Animate deal cards moving through stages
    setInterval(() => {
      dealCards.forEach((card, index) => {
        setTimeout(() => {
          card.style.transform = 'translateY(-5px)';
          setTimeout(() => {
            card.style.transform = 'translateY(0)';
          }, 300);
        }, index * 200);
      });
    }, 3000);
  }
  
  animateWorkflowDemo() {
    const demo = document.querySelector('.workflow-demo');
    if (!demo) return;
    
    const pulse = document.createElement('div');
    pulse.className = 'workflow-pulse';
    pulse.style.cssText = `
      position: absolute;
      width: 20px;
      height: 20px;
      background: #f8cf40;
      border-radius: 50%;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: workflowPulseMove 4s ease-in-out infinite;
    `;
    
    demo.style.position = 'relative';
    demo.appendChild(pulse);
  }
  
  animateRoutingDemo() {
    const hub = document.querySelector('.routing-hub');
    if (!hub) return;
    
    // Pulse animation for routing hub
    setInterval(() => {
      hub.style.transform = 'scale(1.05)';
      setTimeout(() => {
        hub.style.transform = 'scale(1)';
      }, 300);
    }, 2000);
  }
  
  animateDashboardMetrics() {
    const metrics = document.querySelectorAll('.dashboard-metric');
    if (!metrics.length) return;
    
    // Counter animation for metric values
    metrics.forEach(metric => {
      const valueEl = metric.querySelector('.metric-value');
      if (valueEl) {
        const text = valueEl.textContent;
        const match = text.match(/[\d,.]+/);
        if (match) {
          const targetValue = parseFloat(match[0].replace(/,/g, ''));
          this.animateCounter(valueEl, 0, targetValue, 2000, text);
        }
      }
    });
  }
  
  animateCounter(element, start, end, duration, originalText) {
    const startTime = Date.now();
    const prefix = originalText.match(/^[^\d]*/)[0];
    const suffix = originalText.match(/[^\d]*$/)[0];
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * this.easeOutQuart(progress);
      
      let formattedValue = Math.floor(current).toLocaleString();
      element.textContent = prefix + formattedValue + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(element);
        }
      });
    });
    
    observer.observe(element);
  }
  
  easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }
}

// ============================================
// PRICING TIER INTERACTIONS
// ============================================

class PricingInteractions {
  constructor() {
    this.tiers = document.querySelectorAll('.pricing-tier');
    this.init();
  }
  
  init() {
    this.tiers.forEach(tier => {
      tier.addEventListener('mouseenter', () => {
        // Track pricing tier hover
        const tierName = tier.querySelector('.tier__name').textContent;
        if (typeof window.dataLayer !== 'undefined') {
          window.dataLayer.push({
            'event': 'pricing_tier_hover',
            'tier_name': tierName,
            'timestamp': new Date().toISOString()
          });
        }
      });
      
      // Track CTA clicks
      const ctaButton = tier.querySelector('.btn');
      if (ctaButton) {
        ctaButton.addEventListener('click', () => {
          const tierName = tier.querySelector('.tier__name').textContent;
          if (typeof window.dataLayer !== 'undefined') {
            window.dataLayer.push({
              'event': 'pricing_cta_click',
              'tier_name': tierName,
              'timestamp': new Date().toISOString()
            });
          }
        });
      }
    });
  }
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize workflow animations
  if (document.querySelector('.workflow-diagram')) {
    new WorkflowAnimation();
    new DataPulseAnimation();
    new StageInteractivity();
  }
  
  // Initialize component interactions
  if (document.querySelector('.component-card')) {
    new ComponentCardInteractions();
  }
  
  // Initialize visual demo animations
  if (document.querySelector('.sublayer-content__visual')) {
    new VisualDemoAnimations();
  }
  
  // Initialize pricing interactions
  if (document.querySelector('.pricing-tier')) {
    new PricingInteractions();
  }
});

// ============================================
// CSS ANIMATIONS (inject if not in stylesheet)
// ============================================

const style = document.createElement('style');
style.textContent = `
  @keyframes workflowPulseMove {
    0% {
      top: 10%;
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      top: 50%;
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      top: 90%;
      opacity: 0;
    }
  }
  
  .workflow-stage {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .component-card__icon svg {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .dashboard-metric {
    transition: transform 0.3s ease;
  }
  
  .dashboard-metric:hover {
    transform: translateY(-4px);
  }
`;

document.head.appendChild(style);
