/**
 * ============================================
 *  FLOW ENGINE — The Brain of the Bot
 * ============================================
 * 
 * Handles:
 * 1. Intent detection via keyword matching
 * 2. Conversation state machine for lead collection
 * 3. Number-based menu navigation (1-5)
 */

const config = require('./config');
const responses = require('./responses');
const { STATES, getSession, setState, updateLead, resetSession } = require('./sessionManager');
const { saveLead } = require('./leadManager');

/**
 * Intent keywords mapping
 * Each intent has an array of trigger words/phrases
 */
const INTENTS = {
  greeting: [
    'hi', 'hello', 'hey', 'hola', 'sup', 'yo', 'salam',
    'assalam', 'assalamualaikum', 'aoa', 'as salam',
    'good morning', 'good evening', 'good afternoon',
    'start', 'begin',
  ],
  services: [
    'services', 'service', 'what do you do', 'what you do',
    'what can you do', 'offer', 'offerings', 'skills',
    'expertise', 'specialization', 'kya karte', 'work',
  ],
  portfolio: [
    'portfolio', 'projects', 'work samples', 'previous work',
    'past work', 'examples', 'showcase', 'demo', 'demos',
    'github', 'show me',
  ],
  pricing: [
    'pricing', 'price', 'prices', 'cost', 'costs', 'rate',
    'rates', 'charge', 'charges', 'how much', 'kitna',
    'budget', 'fee', 'fees', 'package', 'packages',
    'quotation', 'quote',
  ],
  hire: [
    'hire', 'interested', 'need help', 'want to build',
    'build me', 'make me', 'develop', 'create',
    'i need', 'i want', 'project', 'start a project',
    'let\'s work', 'work together', 'get started',
  ],
  contact: [
    'contact', 'email', 'phone', 'reach', 'call',
    'linkedin', 'social', 'connect', 'message',
    'how to reach', 'get in touch',
  ],
  menu: [
    'menu', 'help', 'options', 'commands', 'what can',
    'list', 'show options',
  ],
  thanks: [
    'thanks', 'thank you', 'thank', 'shukriya', 'jazakallah',
    'appreciated', 'awesome', 'great', 'perfect', 'cool',
    'bye', 'goodbye', 'see you', 'later', 'take care',
  ],
};

/**
 * Number-to-intent mapping (for menu shortcuts)
 */
const NUMBER_MAP = {
  '1': 'services',
  '2': 'portfolio',
  '3': 'pricing',
  '4': 'hire',
  '5': 'contact',
};

/**
 * Detect intent from message text
 * Returns the matched intent or null
 */
function detectIntent(text) {
  const lower = text.toLowerCase().trim();

  // Check number shortcuts first
  if (NUMBER_MAP[lower]) {
    return NUMBER_MAP[lower];
  }

  // Check each intent's keywords
  for (const [intent, keywords] of Object.entries(INTENTS)) {
    for (const keyword of keywords) {
      if (lower === keyword || lower.includes(keyword)) {
        return intent;
      }
    }
  }

  return null;
}

/**
 * Main message handler — processes incoming messages
 * Returns the bot's reply text
 */
function handleMessage(chatId, messageText) {
  const session = getSession(chatId);
  const text = messageText.trim();

  // ─── Handle Lead Collection States ──────────
  // If we're in the middle of collecting info, prioritize that

  if (session.state === STATES.COLLECTING_NAME) {
    return handleNameCollection(chatId, text);
  }

  if (session.state === STATES.COLLECTING_PROJECT) {
    return handleProjectCollection(chatId, text);
  }

  if (session.state === STATES.COLLECTING_BUDGET) {
    return handleBudgetCollection(chatId, text);
  }

  // ─── Handle Intents ─────────────────────────
  const intent = detectIntent(text);

  switch (intent) {
    case 'greeting':
      setState(chatId, STATES.GREETED);
      return responses.welcome();

    case 'services':
      return responses.services();

    case 'portfolio':
      return responses.portfolio();

    case 'pricing':
      return responses.pricing();

    case 'hire':
      setState(chatId, STATES.COLLECTING_NAME);
      return responses.askName();

    case 'contact':
      return responses.contact();

    case 'menu':
      return responses.menu();

    case 'thanks':
      // Reset session so they can start fresh next time
      resetSession(chatId);
      return responses.thanks();

    default:
      // If this is their very first message ever, greet them
      if (session.state === STATES.IDLE) {
        setState(chatId, STATES.GREETED);
        return responses.welcome();
      }
      return responses.fallback();
  }
}

/**
 * Handle name collection step
 */
function handleNameCollection(chatId, text) {
  // If they type a menu command instead, let them navigate
  const intent = detectIntent(text);
  if (intent && intent !== 'hire' && intent !== 'greeting') {
    setState(chatId, STATES.GREETED);
    return handleMessage(chatId, text);
  }

  // Save name and ask for project
  updateLead(chatId, 'name', text);
  setState(chatId, STATES.COLLECTING_PROJECT);
  return responses.askProject(text);
}

/**
 * Handle project need collection step
 */
function handleProjectCollection(chatId, text) {
  // If they type a menu command instead, let them navigate
  const intent = detectIntent(text);
  if (intent === 'menu' || intent === 'greeting') {
    setState(chatId, STATES.GREETED);
    return handleMessage(chatId, text);
  }

  // Save project and ask for budget
  updateLead(chatId, 'project', text);
  setState(chatId, STATES.COLLECTING_BUDGET);
  const session = getSession(chatId);
  return responses.askBudget(text);
}

/**
 * Handle budget collection step
 */
function handleBudgetCollection(chatId, text) {
  const lower = text.toLowerCase().trim();

  // If they type a menu command instead, let them navigate
  const intent = detectIntent(lower);
  if (intent === 'menu' || intent === 'greeting') {
    setState(chatId, STATES.GREETED);
    return handleMessage(chatId, text);
  }

  // Parse budget — accept number shortcuts or free text
  let budget = text;
  const num = parseInt(lower);
  if (num >= 1 && num <= config.budgetOptions.length) {
    budget = config.budgetOptions[num - 1];
  }

  // Save budget and complete lead
  updateLead(chatId, 'budget', budget);
  const session = getSession(chatId);
  const lead = session.lead;

  // Save to file
  saveLead(lead, chatId);

  // Mark as captured and reset
  setState(chatId, STATES.LEAD_CAPTURED);

  return responses.leadCaptured(lead);
}

module.exports = { handleMessage };
