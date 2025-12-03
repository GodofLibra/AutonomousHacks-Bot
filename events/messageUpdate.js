/**
 * Event: messageUpdate
 * Description: Triggered when a message is edited.
 * Action: Logs the old and new content of the message to the log channel.
 */
const logger = require('../utils/logger');

module.exports = {
    name: 'messageUpdate',
    async execute(oldMessage, newMessage) {
        if (oldMessage.partial || newMessage.partial) return;
        if (oldMessage.content === newMessage.content) return;

        await logger(newMessage.client, 'Message Updated', `Message by ${newMessage.author.tag} in ${newMessage.channel.name} updated:\n**Old:** "${oldMessage.content}"\n**New:** "${newMessage.content}"`, 0xFFFF00);

        // DB Logging
        const db = require('../utils/db');
        await db.logAudit(newMessage.client, newMessage.author, 'Message Updated', `Edited in #${newMessage.channel.name}.\nOld: "${oldMessage.content}"\nNew: "${newMessage.content}"`, 0xFFFF00);
    },
};
