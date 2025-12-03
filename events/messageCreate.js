/**
 * Event: messageCreate
 * Description: Triggered when a message is sent. Checks for moderation violations.
 * Action: Deletes violating messages, warns the user, and logs the incident.
 */
const logger = require('../utils/logger');
const moderation = require('../utils/moderation');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        // Ignore bot messages
        if (message.author.bot) return;

        // Check for Banned Content
        if (moderation.containsBannedContent(message.content)) {
            try {
                await message.delete();
                // Mute user for 5 minutes
                if (message.member.moderatable) {
                    await message.member.timeout(5 * 60 * 1000, 'Violated banned content policy');
                }
                await message.channel.send(`${message.author}, your message was removed and you have been muted for 5 minutes because it contained prohibited content.`);
                await logger(message.client, 'Moderation: Banned Content', `User: ${message.author.tag}\nChannel: ${message.channel.name}\nContent: ||${message.content}||\nAction: Muted for 5m`, 0xFF0000);

                // DB Logging
                const db = require('../utils/db');
                await db.logAudit(message.client, message.author, 'Moderation', `Deleted message containing banned content and muted user.`, 0xFF0000);
                return;
            } catch (error) {
                console.error('Error handling banned content:', error);
            }
        }

        // Check for Spam
        if (moderation.isSpam(message.author.id, message.content)) {
            try {
                await message.delete();
                // Mute user for 5 minutes
                if (message.member.moderatable) {
                    await message.member.timeout(5 * 60 * 1000, 'Spamming');
                }
                // Send warning only once per spam burst to avoid spamming the channel
                await message.channel.send(`${message.author}, please stop spamming. You have been muted for 5 minutes.`);
                await logger(message.client, 'Moderation: Spam Detected', `User: ${message.author.tag}\nChannel: ${message.channel.name}\nContent: "${message.content}"\nAction: Muted for 5m`, 0xFFA500);

                // DB Logging
                const db = require('../utils/db');
                await db.logAudit(message.client, message.author, 'Moderation', `User warned and muted for spamming.`, 0xFFA500);
                return;
            } catch (error) {
                console.error('Error handling spam:', error);
            }
        }
    },
};
