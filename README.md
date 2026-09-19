# 🤖 WA-Bot — WhatsApp Freelance Assistant

A free, hardcoded WhatsApp chatbot that represents your freelance services, showcases your portfolio, and collects client leads — all automatically.

**Cost: $0** — No APIs, no databases, no subscriptions.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies (already done if you cloned this)
npm install

# 2. Start the bot
npm start

# 3. Scan the QR code with WhatsApp
#    WhatsApp → Settings → Linked Devices → Link a Device

# 4. Done! The bot will auto-reply to messages
```

---

## 🎯 What the Bot Does

| Feature | How It Works |
|---------|-------------|
| **Greets visitors** | Auto-responds to hi/hello with a welcome menu |
| **Shows services** | Lists your skills & offerings |
| **Shares portfolio** | Sends your website, GitHub, LinkedIn links |
| **Shows pricing** | Displays your rate card |
| **Collects leads** | Asks name → project → budget, saves to `data/leads.json` |
| **Contact info** | Shares your contact details |

---

## 📁 Project Structure

```
wa-bot/
├── package.json
├── .gitignore
├── data/
│   └── leads.json          ← Auto-created, stores collected leads
├── src/
│   ├── index.js             ← Entry point (starts WhatsApp client)
│   ├── config.js            ← ⭐ YOUR DETAILS — edit this file!
│   ├── responses.js         ← Message templates
│   ├── flowEngine.js        ← Intent detection + conversation state
│   ├── sessionManager.js    ← Per-user session tracking
│   └── leadManager.js       ← Lead storage
└── README.md
```

---

## ✏️ Customize

Edit **`src/config.js`** to change:
- Your name, title, tagline
- Services list
- Portfolio links
- Pricing packages
- Contact info

That's the **only file** you need to touch!

---

## ⚠️ Important Notes

- **Use a secondary phone number** — WhatsApp can ban numbers using unofficial APIs
- **First run takes longer** — It downloads Chromium for the browser engine
- **Session persists** — After first QR scan, you won't need to re-scan on restart
- **Private chats only** — The bot ignores group messages by default (configurable in `config.js`)

---

## 📋 Viewing Leads

All collected leads are saved in `data/leads.json`:

```json
{
  "id": 1,
  "name": "Ahmed",
  "project": "WhatsApp bot for restaurant",
  "budget": "$100 - $500",
  "phone": "923001234567",
  "timestamp": "2026-09-20T01:00:00.000Z",
  "status": "new"
}
```

---

Built with ❤️ by Muhammad Abdullah
