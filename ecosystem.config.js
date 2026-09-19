/**
 * PM2 Ecosystem Config
 * 
 * Manages the bot process — auto-restart on crash,
 * runs in background, survives terminal close.
 * 
 * Commands:
 *   pm2 start ecosystem.config.js   → Start the bot
 *   pm2 stop wa-bot                 → Stop the bot
 *   pm2 restart wa-bot              → Restart the bot
 *   pm2 logs wa-bot                 → View live logs
 *   pm2 status                      → Check if bot is running
 *   pm2 save                        → Save process list
 *   pm2 startup                     → Auto-start on system boot
 */

module.exports = {
  apps: [
    {
      name: 'wa-bot',
      script: 'src/index.js',
      watch: false,
      autorestart: true,
      restart_delay: 5000,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
