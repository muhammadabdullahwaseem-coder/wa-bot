/**
 * ============================================
 *  SESSION MANAGER
 * ============================================
 * 
 * Tracks per-user conversation state in memory.
 * Sessions auto-expire after configured timeout.
 */

const config = require('./config');

// In-memory store: chatId -> session data
const sessions = new Map();

const TIMEOUT_MS = config.settings.sessionTimeoutMinutes * 60 * 1000;

/**
 * Conversation states
 */
const STATES = {
  IDLE: 'IDLE',
  GREETED: 'GREETED',
  COLLECTING_NAME: 'COLLECTING_NAME',
  COLLECTING_PROJECT: 'COLLECTING_PROJECT',
  COLLECTING_BUDGET: 'COLLECTING_BUDGET',
  LEAD_CAPTURED: 'LEAD_CAPTURED',
};

/**
 * Get or create a session for a chat
 */
function getSession(chatId) {
  let session = sessions.get(chatId);

  if (session) {
    // Check if session has expired
    const elapsed = Date.now() - session.lastActivity;
    if (elapsed > TIMEOUT_MS) {
      // Reset expired session
      session = createSession(chatId);
    } else {
      session.lastActivity = Date.now();
    }
  } else {
    session = createSession(chatId);
  }

  sessions.set(chatId, session);
  return session;
}

/**
 * Create a fresh session
 */
function createSession(chatId) {
  return {
    chatId,
    state: STATES.IDLE,
    lastActivity: Date.now(),
    lead: {
      name: null,
      project: null,
      budget: null,
    },
  };
}

/**
 * Update session state
 */
function setState(chatId, newState) {
  const session = getSession(chatId);
  session.state = newState;
  session.lastActivity = Date.now();
  sessions.set(chatId, session);
}

/**
 * Update lead data in session
 */
function updateLead(chatId, field, value) {
  const session = getSession(chatId);
  session.lead[field] = value;
  session.lastActivity = Date.now();
  sessions.set(chatId, session);
}

/**
 * Reset session to idle
 */
function resetSession(chatId) {
  sessions.set(chatId, createSession(chatId));
}

/**
 * Cleanup expired sessions (call periodically)
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [chatId, session] of sessions) {
    if (now - session.lastActivity > TIMEOUT_MS) {
      sessions.delete(chatId);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupExpired, 10 * 60 * 1000);

module.exports = {
  STATES,
  getSession,
  setState,
  updateLead,
  resetSession,
};
