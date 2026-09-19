/**
 * ============================================
 *  MESSAGE TEMPLATES
 * ============================================
 * 
 * All bot responses are generated from config.
 * WhatsApp-friendly formatting: *bold*, _italic_, emojis, short lines.
 */

const config = require('./config');

const responses = {
  // ─── Welcome / Greeting ──────────────────────
  welcome: () =>
    `Hey there! 👋 Welcome!\n\n` +
    `I'm *${config.name}'s* virtual assistant.\n` +
    `He's a *${config.title}* — ${config.tagline}\n\n` +
    `Here's what I can help with:\n\n` +
    `1️⃣ *Services* — What he builds\n` +
    `2️⃣ *Portfolio* — Past work & projects\n` +
    `3️⃣ *Pricing* — Rates & packages\n` +
    `4️⃣ *Hire* — Start a project\n` +
    `5️⃣ *Contact* — Get in touch\n\n` +
    `Just type a keyword or number! 😊`,

  // ─── Services ────────────────────────────────
  services: () => {
    const list = config.services
      .map(s => `${s.emoji} *${s.name}*\n    ${s.desc}`)
      .join('\n\n');

    return `Here's what ${config.name} can build for you 💻\n\n` +
      `${list}\n\n` +
      `Interested in any of these? Type *hire* to get started! 🚀`;
  },

  // ─── Portfolio ───────────────────────────────
  portfolio: () => {
    let msg = `Check out ${config.name}'s work 📂\n\n`;

    if (config.portfolio.website) {
      msg += `🌐 *Portfolio:* ${config.portfolio.website}\n\n`;
    }
    if (config.portfolio.github) {
      msg += `💻 *GitHub:* ${config.portfolio.github}\n\n`;
    }
    if (config.portfolio.linkedin) {
      msg += `🔗 *LinkedIn:* ${config.portfolio.linkedin}\n\n`;
    }

    msg += `Want to work together? Type *hire*! 🤝`;
    return msg;
  },

  // ─── Pricing ─────────────────────────────────
  pricing: () => {
    const list = config.pricing
      .map(p => `${p.emoji} *${p.name}*: ${p.range}`)
      .join('\n');

    return `Here are the typical rates 💰\n\n` +
      `${list}\n\n` +
      `_Prices vary based on complexity & features._\n` +
      `Type *hire* to discuss your project! 🎯`;
  },

  // ─── Contact ─────────────────────────────────
  contact: () => {
    let msg = `Here's how to reach ${config.name} 📬\n\n`;

    if (config.contact.email) {
      msg += `📧 *Email:* ${config.contact.email}\n`;
    }
    if (config.contact.whatsapp) {
      msg += `📱 *WhatsApp:* ${config.contact.whatsapp}\n`;
    }
    if (config.contact.linkedin) {
      msg += `🔗 *LinkedIn:* ${config.contact.linkedin}\n`;
    }
    if (config.contact.github) {
      msg += `💻 *GitHub:* ${config.contact.github}\n`;
    }

    msg += `\nOr just type *hire* right here and we'll get started! 🚀`;
    return msg;
  },

  // ─── Menu (same as welcome but shorter) ──────
  menu: () =>
    `Here's what I can help with 📋\n\n` +
    `1️⃣ *Services* — What he builds\n` +
    `2️⃣ *Portfolio* — Past work\n` +
    `3️⃣ *Pricing* — Rates & packages\n` +
    `4️⃣ *Hire* — Start a project\n` +
    `5️⃣ *Contact* — Get in touch\n\n` +
    `Type a keyword or number! 😊`,

  // ─── Hire Flow: Ask Name ─────────────────────
  askName: () =>
    `Awesome! Let's get you started 🎯\n\n` +
    `First, what's your *name*?`,

  // ─── Hire Flow: Ask Project ──────────────────
  askProject: (name) =>
    `Nice to meet you, *${name}*! 🤝\n\n` +
    `What kind of *project* do you need?\n` +
    `_(e.g., "e-commerce website", "WhatsApp bot", "AI dashboard")_`,

  // ─── Hire Flow: Ask Budget ───────────────────
  askBudget: (projectNeed) => {
    const options = config.budgetOptions
      .map((b, i) => `${i + 1}️⃣ ${b}`)
      .join('\n');

    return `Cool! *${projectNeed}* — sounds like a great project 🔥\n\n` +
      `Last question — what's your *budget range*?\n\n` +
      `${options}\n\n` +
      `_Just type the number!_`;
  },

  // ─── Hire Flow: Lead Captured ────────────────
  leadCaptured: (lead) =>
    `Perfect, *${lead.name}*! ✅ Here's what I got:\n\n` +
    `📋 *Lead Summary:*\n` +
    `👤 Name: ${lead.name}\n` +
    `📝 Project: ${lead.project}\n` +
    `💰 Budget: ${lead.budget}\n\n` +
    `${config.name} will review this and get back to you *within 24 hours*! 🙌\n` +
    `Thanks for reaching out! 💚`,

  // ─── Fallback (unknown message) ──────────────
  fallback: () =>
    `Hmm, I didn't quite get that 🤔\n\n` +
    `Try one of these:\n` +
    `• *services* — what he builds\n` +
    `• *portfolio* — past work\n` +
    `• *pricing* — rates\n` +
    `• *hire* — start a project\n` +
    `• *menu* — see all options\n\n` +
    `Or just say *hi* to start over! 👋`,

  // ─── Thanks ──────────────────────────────────
  thanks: () =>
    `You're welcome! 😊\n\n` +
    `Feel free to message anytime. ${config.name} is always happy to help! 💚\n` +
    `Type *menu* if you need anything else.`,
};

module.exports = responses;
