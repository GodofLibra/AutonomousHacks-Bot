/**
 * Event: ready
 * Description: Triggered when the bot successfully logs in and is online.
 * Action: Logs a success message to the console and the log channel.
 */
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        logger(client, 'Bot Online', `Logged in as ${client.user.tag}!`, 0x00FF00);

        // DB Logging
        const db = require('../utils/db');
        // Mock user object for the bot itself
        const botUser = client.user;
        db.logAudit(client, botUser, 'System', 'Bot is now Online', 0x00FF00);
    },
};
