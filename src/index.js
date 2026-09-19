/**
 * ============================================
 *  WA-BOT — Entry Point
 * ============================================
 * 
 * WhatsApp chatbot for freelance services.
 * Uses whatsapp-web.js with LocalAuth (no re-scanning QR).
 * 
 * Run: node src/index.js
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const { handleMessage } = require('./flowEngine');

// ─── Initialize Client ────────────────────────
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--disable-gpu',
    ],
  },
});

// ─── QR Code Event ─────────────────────────────
client.on('qr', (qr) => {
  console.log('\n📱 Scan this QR code with WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nOpen WhatsApp → Settings → Linked Devices → Link a Device\n');
});

// ─── Ready Event ───────────────────────────────
client.on('ready', () => {
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
});

// ─── Authentication Events ─────────────────────
client.on('authenticated', () => {
  console.log('✅ Authentication successful!');
});

client.on('auth_failure', (msg) => {
  console.error('❌ Authentication failed:', msg);
  console.log('💡 Try deleting .wwebjs_auth folder and restart.');
});

// ─── Message Handler ───────────────────────────
client.on('message', async (message) => {
  try {
    // Skip status updates, media-only, and empty messages first
    if (message.isStatus || !message.body || message.body.trim() === '') {
      return;
    }

    // Skip group messages if configured (group IDs end with @g.us)
    const isGroup = message.from.endsWith('@g.us');
    if (isGroup && !config.settings.respondInGroups) {
      return;
    }

    const chatId = message.from;
    const text = message.body;

    console.log(`📩 [${chatId}]: ${text}`);

    // Process message through flow engine
    const reply = handleMessage(chatId, text);

    // Add slight delay to feel natural
    if (config.settings.responseDelayMs > 0) {
      await new Promise(r => setTimeout(r, config.settings.responseDelayMs));
    }

    // Send reply
    await message.reply(reply);
    console.log(`📤 [Reply sent to ${chatId}]`);

  } catch (error) {
    console.error('❌ Error handling message:', error);
  }
});

// ─── Disconnection Handler ─────────────────────
client.on('disconnected', (reason) => {
  console.log('⚠️  Bot disconnected:', reason);
  console.log('🔄 Attempting to reconnect...');
  client.initialize();
});

// ─── Start the Bot ─────────────────────────────
console.log('\n🚀 Starting WhatsApp Bot...');
console.log('⏳ Loading... (this may take a moment on first run)\n');
client.initialize();
