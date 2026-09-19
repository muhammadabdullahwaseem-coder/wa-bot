/**
 * ============================================
 *  BOT CONFIGURATION — Edit your details here
 * ============================================
 * 
 * This is the ONLY file you need to edit to personalize the bot.
 * When selling as a service, clients just change this file.
 */

const config = {
  // ─── Owner Details ───────────────────────────
  name: 'Muhammad Abdullah',
  title: 'MERN Stack & AI Developer',
  tagline: 'Building web apps, AI chatbots & automation tools 🚀',

  // ─── Services ────────────────────────────────
  services: [
    { emoji: '🌐', name: 'Full-Stack Web Apps', desc: 'React, Next.js, Node.js, MongoDB' },
    { emoji: '🤖', name: 'AI Chatbots', desc: 'WhatsApp, Telegram, website bots' },
    { emoji: '⚡', name: 'Automation', desc: 'Workflows, scrapers, API integrations' },
    { emoji: '🧠', name: 'AI Integration', desc: 'OpenAI, Gemini, custom ML in your app' },
    { emoji: '📱', name: 'Landing Pages & Portfolios', desc: 'Fast, beautiful, conversion-focused' },
  ],

  // ─── Portfolio Links ─────────────────────────
  portfolio: {
    website: 'https://muhammad-abdullah-portfolio1.netlify.app/',
    github: 'https://github.com/muhammadabdullahwaseem-coder',
    linkedin: 'https://www.linkedin.com/in/muhammad-abdullah-waseem/',
  },

  // ─── Pricing ─────────────────────────────────
  pricing: [
    { emoji: '🟢', name: 'Landing Page / Portfolio', range: '$50 - $150' },
    { emoji: '🔵', name: 'Full-Stack Web App', range: '$200 - $800' },
    { emoji: '🤖', name: 'WhatsApp / AI Chatbot', range: '$100 - $500' },
    { emoji: '⚡', name: 'Automation / Integration', range: '$100 - $400' },
    { emoji: '🎨', name: 'Custom Project', range: 'Let\'s discuss!' },
  ],

  // ─── Contact Info ────────────────────────────
  contact: {
    email: null,         // Add your email: 'your@email.com'
    whatsapp: null,      // Add if different from bot number
    linkedin: 'https://www.linkedin.com/in/muhammad-abdullah-waseem/',
    github: 'https://github.com/muhammadabdullahwaseem-coder',
  },

  // ─── Budget Options (for lead collection) ────
  budgetOptions: [
    'Under $100',
    '$100 - $500',
    '$500 - $1000',
    '$1000+',
    'Not sure yet — let\'s discuss',
  ],

  // ─── Bot Settings ────────────────────────────
  settings: {
    respondInGroups: false,        // Set true to respond in group chats
    sessionTimeoutMinutes: 30,     // Reset conversation after inactivity
    responseDelayMs: 800,          // Slight delay to feel natural (ms)
  },
};

module.exports = config;
