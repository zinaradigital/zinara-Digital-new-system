/**
 * ZINARA DIGITAL - CHATBOT INTEGRATION
 * Tidio Configuration & Diagnostic Flows
 */

// ============================================
// CHATBOT CONFIGURATION
// ============================================

document.addEventListener('tidioChat-ready', function() {
  
  // ============================================
  // BRAND CUSTOMIZATION
  // ============================================
  
  window.tidioChatApi.setColorPalette({
    primary: '#f8cf40',      // Gold button
    secondary: '#00043F',    // Navy header
    text: '#1A1A1A',
    background: '#FFFFFF'
  });
  
  // ============================================
  // VISITOR TRACKING
  // ============================================
  
  const visitorId = 'visitor_' + Date.now();
  const pageData = {
    distinct_id: visitorId,
    tags: ['diagnostic-intent'],
    page_url: window.location.href,
    page_title: document.title,
    page_type: getPageType(),
    referrer: document.referrer
  };
  
  window.tidioChatApi.setVisitorData(pageData);
  
  // ============================================
  // AUTO-TRIGGER LOGIC
  // ============================================
  
  const isMobile = window.innerWidth < 768;
  const autoTriggerDelay = isMobile ? 15000 : 8000; // 15s mobile, 8s desktop
  
  // Only auto-trigger on first visit
  if (!hasSeenChatbot()) {
    setTimeout(function() {
      window.tidioChatApi.open();
      markChatbotSeen();
      
      // Track auto-trigger event
      trackChatbotEvent('chatbot_auto_opened', {
        device_type: isMobile ? 'mobile' : 'desktop',
        delay: autoTriggerDelay
      });
    }, autoTriggerDelay);
  }
  
  // ============================================
  // EVENT TRACKING
  // ============================================
  
  // Track when user sends a message
  window.tidioChatApi.on('messageFromVisitor', function(data) {
    trackChatbotEvent('chatbot_message_sent', {
      message_length: data.message ? data.message.length : 0
    });
  });
  
  // Track when chatbot opens
  window.tidioChatApi.on('open', function() {
    trackChatbotEvent('chatbot_opened', {
      trigger: 'manual'
    });
  });
  
  // Track when chatbot closes
  window.tidioChatApi.on('close', function() {
    trackChatbotEvent('chatbot_closed', {});
  });
  
  // Track email capture (PRIMARY CONVERSION)
  window.tidioChatApi.on('emailCollected', function(data) {
    trackChatbotEvent('chatbot_email_captured', {
      event_category: 'chatbot',
      event_label: 'lead_conversion',
      value: 1
    });
    
    // Also track in dataLayer
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        'event': 'lead_generated',
        'lead_source': 'chatbot',
        'lead_email': data.email,
        'timestamp': new Date().toISOString()
      });
    }
  });
  
  // ============================================
  // CUSTOM CHATBOT METHODS
  // ============================================
  
  // Programmatically trigger diagnostic flow
  window.startDiagnostic = function() {
    window.tidioChatApi.open();
    // Send automated message to start flow
    window.tidioChatApi.sendMessage('start_diagnostic');
  };
  
  // Route user to specific layer
  window.routeToLayer = function(layerNumber) {
    const layerUrls = {
      1: '/digital-marketing-systems.html?utm_source=chatbot',
      2: '/ai-training.html?utm_source=chatbot',
      3: '/revenue-infrastructure.html?utm_source=chatbot'
    };
    
    if (layerUrls[layerNumber]) {
      window.location.href = layerUrls[layerNumber];
    }
  };
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function hasSeenChatbot() {
  return localStorage.getItem('zinara_chat_seen') === 'true';
}

function markChatbotSeen() {
  localStorage.setItem('zinara_chat_seen', 'true');
}

function getPageType() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'homepage';
  if (path.includes('digital-marketing')) return 'layer_1';
  if (path.includes('ai-training')) return 'layer_2';
  if (path.includes('revenue-infrastructure')) return 'layer_3';
  if (path.includes('revenue-audit')) return 'audit';
  return 'other';
}

function trackChatbotEvent(eventName, eventData = {}) {
  // Track in Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, {
      event_category: 'chatbot',
      ...eventData
    });
  }
  
  // Track in dataLayer
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      'event': eventName,
      ...eventData,
      'timestamp': new Date().toISOString()
    });
  }
}

// ============================================
// DIAGNOSTIC FLOW VARIABLES (for Tidio setup)
// ============================================

/**
 * These conversation flows should be configured in Tidio dashboard.
 * Below is the reference structure for implementation.
 */

const DIAGNOSTIC_FLOWS = {
  opening_message: {
    trigger: 'auto_trigger',
    delay: 8000, // 8 seconds desktop, 15 mobile
    message: `
This is a diagnostic tool, not a sales chat.

I identify which of Zinara's 4 layers is failing:
1️⃣ Digital Marketing Systems (revenue attribution unknown)
2️⃣ AI Training & Adoption (teams don't use tools)
3️⃣ Revenue Infrastructure (manual handling, lost leads)
4️⃣ Governance (no oversight or audits)

Answer 3 questions. I'll route you to the right diagnostic.
    `,
    buttons: [
      { text: 'Start Diagnostic', action: 'q1' },
      { text: 'Skip to Revenue Audit', url: '/revenue-audit.html' },
      { text: 'Close', action: 'close' }
    ]
  },
  
  question_1: {
    id: 'q1',
    message: 'Current state of your revenue system?',
    options: [
      {
        text: 'Marketing campaigns run, but I can\'t measure which produce revenue',
        variable: 'layer_diagnosis',
        value: 'digital_marketing',
        next: 'q2'
      },
      {
        text: 'We purchased AI tools (ChatGPT, CRM), but teams don\'t use them',
        variable: 'layer_diagnosis',
        value: 'ai_training',
        next: 'q2'
      },
      {
        text: 'Leads arrive via WhatsApp/email/calls, but manual follow-up fails',
        variable: 'layer_diagnosis',
        value: 'infrastructure',
        next: 'q2'
      },
      {
        text: 'No systematic oversight, audits, or diagnostic process',
        variable: 'layer_diagnosis',
        value: 'governance',
        next: 'q2'
      },
      {
        text: 'Multiple issues / Not sure',
        variable: 'layer_diagnosis',
        value: 'full_audit',
        next: 'q2'
      }
    ]
  },
  
  question_2: {
    id: 'q2',
    message: 'Monthly revenue (KSh)?',
    options: [
      {
        text: 'Under 500K',
        variable: 'revenue_bracket',
        value: 'under_500k',
        next: 'q3'
      },
      {
        text: '500K - 2M',
        variable: 'revenue_bracket',
        value: '500k_2m',
        next: 'q3'
      },
      {
        text: '2M - 10M',
        variable: 'revenue_bracket',
        value: '2m_10m',
        next: 'q3'
      },
      {
        text: '10M+',
        variable: 'revenue_bracket',
        value: '10m_plus',
        next: 'q3'
      },
      {
        text: 'Prefer not to say',
        variable: 'revenue_bracket',
        value: 'undisclosed',
        next: 'q3'
      }
    ]
  },
  
  question_3: {
    id: 'q3',
    message: 'What happens next if this diagnostic is accurate?',
    options: [
      {
        text: 'Request paid audit within 7 days',
        variable: 'intent',
        value: 'high',
        action: 'email_capture'
      },
      {
        text: 'Want to understand pricing first',
        variable: 'intent',
        value: 'medium',
        action: 'show_pricing'
      },
      {
        text: 'Just researching, no immediate action',
        variable: 'intent',
        value: 'low',
        action: 'route_resources'
      },
      {
        text: 'Need team approval before proceeding',
        variable: 'intent',
        value: 'medium',
        action: 'shareable_materials'
      }
    ]
  },
  
  routing_digital_marketing: {
    condition: 'layer_diagnosis == "digital_marketing"',
    message: `
✅ Layer 1 failing: Digital Marketing without revenue visibility.

You need: Campaign audit + revenue attribution mapping + lead capture systems.

Next steps:
→ Review Digital Marketing Systems page (3 min read)
→ Request Layer 1 Diagnostic Audit (free, 45 min)

Timeline: Audit within 3 business days
Investment: KSh 30K-50K/month (subscription)
    `,
    buttons: [
      { text: 'View Digital Marketing Systems', url: '/digital-marketing-systems.html?utm_source=chatbot&utm_medium=diagnostic&utm_campaign=layer1-routing' },
      { text: 'Request Audit Now', action: 'email_capture' },
      { text: 'Close', action: 'close' }
    ]
  },
  
  routing_ai_training: {
    condition: 'layer_diagnosis == "ai_training"',
    message: `
✅ Layer 2 failing: AI tools purchased but teams can't operate them.

You need: Structured AI training + adoption workflows + capability building.

Next steps:
→ Review AI Training & Adoption page (3 min read)
→ Request Layer 2 Diagnostic Audit (free, 45 min)

Timeline: Audit within 3 business days
Investment: KSh 25K-40K/month (subscription)
    `,
    buttons: [
      { text: 'View AI Training Program', url: '/ai-training.html?utm_source=chatbot&utm_medium=diagnostic&utm_campaign=layer2-routing' },
      { text: 'Request Audit Now', action: 'email_capture' },
      { text: 'Close', action: 'close' }
    ]
  },
  
  routing_infrastructure: {
    condition: 'layer_diagnosis == "infrastructure"',
    message: `
✅ Layer 3 failing: Manual handling leaks revenue after first contact.

You need: CRM automation + workflow routing + recovery systems + dashboards.

Next steps:
→ Review Revenue Infrastructure page (5 min read)
→ Request Layer 3 Diagnostic Audit (free, 45 min)

Timeline: Audit within 3 business days
Investment: KSh 30K-75K/month (subscription)
    `,
    buttons: [
      { text: 'View Revenue Infrastructure', url: '/revenue-infrastructure.html?utm_source=chatbot&utm_medium=diagnostic&utm_campaign=layer3-routing' },
      { text: 'Request Audit Now', action: 'email_capture' },
      { text: 'Close', action: 'close' }
    ]
  },
  
  email_capture: {
    action: 'collect_email',
    message: 'Please provide your email to receive your diagnostic report and schedule your audit.',
    success_message: `
Thank you! Check your email within 10 minutes for:

✅ Your diagnostic report
✅ Calendar link to schedule audit
✅ Pre-audit questionnaire

We'll analyze your responses before the call so the 45 minutes is pure diagnostic value.
    `,
    redirect_url: '/thank-you.html?source=chatbot'
  }
};

// ============================================
// CHATBOT ANALYTICS DASHBOARD
// ============================================

/**
 * Track these metrics in analytics:
 * 
 * PRIMARY METRICS:
 * - chatbot_opened (total opens)
 * - chatbot_email_captured (conversion rate)
 * - chatbot_diagnostic_completed (completion rate)
 * 
 * SECONDARY METRICS:
 * - chatbot_q1_answered (drop-off after Q1)
 * - chatbot_q2_answered (drop-off after Q2)
 * - chatbot_q3_answered (drop-off after Q3)
 * 
 * DIAGNOSTIC ACCURACY:
 * - layer_diagnosed (which layer was identified)
 * - revenue_bracket (revenue qualification)
 * - intent_level (high/medium/low intent)
 * 
 * CONVERSION FUNNEL:
 * Chatbot Opened → Q1 → Q2 → Q3 → Email Captured → Audit Scheduled
 */

// Export flow structure for reference
if (typeof window !== 'undefined') {
  window.ZINARA_DIAGNOSTIC_FLOWS = DIAGNOSTIC_FLOWS;
}
