/**
 * ============================================
 *  LEAD MANAGER
 * ============================================
 * 
 * Saves captured leads to a local JSON file.
 * Each lead includes name, project, budget,
 * phone number, and timestamp.
 */

const fs = require('fs');
const path = require('path');

const LEADS_DIR = path.join(__dirname, '..', 'data');
const LEADS_FILE = path.join(LEADS_DIR, 'leads.json');

/**
 * Ensure data directory and file exist
 */
function ensureFile() {
  if (!fs.existsSync(LEADS_DIR)) {
    fs.mkdirSync(LEADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Load all leads
 */
function getLeads() {
  ensureFile();
  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * Save a new lead
 * @param {Object} lead - { name, project, budget }
 * @param {string} chatId - WhatsApp chat ID (contains phone number)
 */
function saveLead(lead, chatId) {
  const leads = getLeads();

  const newLead = {
    id: leads.length + 1,
    name: lead.name,
    project: lead.project,
    budget: lead.budget,
    phone: chatId.replace('@c.us', ''),
    timestamp: new Date().toISOString(),
    status: 'new',
  };

  leads.push(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

  console.log(`\n📋 NEW LEAD CAPTURED!`);
  console.log(`   👤 ${newLead.name}`);
  console.log(`   📝 ${newLead.project}`);
  console.log(`   💰 ${newLead.budget}`);
  console.log(`   📱 ${newLead.phone}`);
  console.log(`   🕐 ${newLead.timestamp}\n`);

  return newLead;
}

module.exports = { saveLead, getLeads };
