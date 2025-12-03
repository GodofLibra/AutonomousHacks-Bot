/**
 * Event: messageDelete
 * Description: Triggered when a message is deleted.
 * Action: Logs the deleted message content and author to the log channel.
 */
const logger = require('../utils/logger');

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        if (message.partial) return; // Cannot fetch content of partial messages
        await logger(message.client, 'Message Deleted', `Message by ${message.author.tag} deleted in ${message.channel.name}:\n"${message.content}"`, 0xFFA500);

        // DB Logging
        const db = require('../utils/db');
        await db.logAudit(message.client, message.author, 'Message Deleted', `Deleted in #${message.channel.name}: "${message.content}"`, 0xFFA500);
    },
};
