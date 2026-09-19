/**
 * ============================================
 *  WA-BOT — Entry Point (Baileys Engine)
 * ============================================
 * 
 * WhatsApp chatbot for freelance services.
 * Uses Baileys (WebSocket-based, no Chrome needed).
 * Works on Termux, Linux, Windows, Mac — everywhere.
 * 
 * Run: node src/index.js
 */

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const config = require('./config');
const { handleMessage } = require('./flowEngine');

const qrcode = require('qrcode-terminal');

// Suppress noisy Baileys logs (set to 'debug' for troubleshooting)
const logger = {
  level: 'silent',
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: (...args) => console.error('⚠️ ', ...args),
  child: () => logger,
};

async function startBot() {
  // ─── Load Auth State (persists session) ──────
  const { state, saveCreds } = await useMultiFileAuthState('auth_session');
  const { version } = await fetchLatestBaileysVersion();

  // ─── Create Socket ───────────────────────────
  const sock = makeWASocket({
    version,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    printQRInTerminal: false, // We will handle it manually
    logger,
    generateHighQualityLinkPreview: false,
  });

  // ─── Save Credentials on Update ──────────────
  sock.ev.on('creds.update', saveCreds);

  // ─── Connection Handler ──────────────────────
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('\n📱 Scan the QR code above with WhatsApp:');
      console.log('   WhatsApp → Settings → Linked Devices → Link a Device\n');
    }

    if (connection === 'open') {
      console.log('\n╔══════════════════════════════════════════╗');
      console.log('║                                          ║');
      console.log('║   🤖 WhatsApp Bot is LIVE!               ║');
      console.log(`║   👤 ${config.name.padEnd(33)}║`);
      console.log(`║   💼 ${config.title.padEnd(33)}║`);
      console.log('║                                          ║');
      console.log('║   Waiting for messages...                ║');
      console.log('║   Press Ctrl+C to stop                   ║');
      console.log('║                                          ║');
      console.log('╚══════════════════════════════════════════╝\n');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log('🔄 Connection lost. Reconnecting...');
        startBot();
      } else {
        console.log('🚪 Logged out. Delete auth_session folder and restart to re-scan QR.');
      }
    }
  });

  // ─── Message Handler ─────────────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    try {
      // Only process new messages (not history sync)
      if (type !== 'notify') return;

      const msg = messages[0];
      if (!msg || !msg.message) return;

      // Skip our own messages
      if (msg.key.fromMe) return;

      // Skip group messages if configured
      const chatId = msg.key.remoteJid;
      const isGroup = chatId.endsWith('@g.us');
      if (isGroup && !config.settings.respondInGroups) return;

      // Extract message text (handle different message types)
      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      if (!text || text.trim() === '') return;

      console.log(`📩 [${chatId}]: ${text}`);

      // Process through flow engine
      const reply = handleMessage(chatId, text);

      // Add slight delay to feel natural
      if (config.settings.responseDelayMs > 0) {
        await new Promise(r => setTimeout(r, config.settings.responseDelayMs));
      }

      // Send reply
      await sock.sendMessage(chatId, { text: reply });
      console.log(`📤 [Reply sent to ${chatId}]`);

    } catch (error) {
      console.error('❌ Error handling message:', error.message);
    }
  });
}

// ─── Start the Bot ─────────────────────────────
console.log('\n🚀 Starting WhatsApp Bot...');
console.log('⏳ Connecting... (first run will show QR code)\n');
startBot();
