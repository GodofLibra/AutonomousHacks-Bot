/**
 * Utility: Logger
 * Description: Sends formatted embed logs to a specified Discord channel.
 * Usage: logger(client, title, description, color)
 */
const { EmbedBuilder } = require('discord.js');

module.exports = async (client, title, description, color = 0x0099FF) => {
    try {
        const logChannelId = process.env.AUDIT_CHANNEL_ID;
        if (!logChannelId) {
            console.warn('AUDIT_CHANNEL_ID is not set in .env');
            return;
        }

        const channel = await client.channels.fetch(logChannelId);
        if (!channel) {
            console.error(`Audit channel with ID ${logChannelId} not found.`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Error sending log:', error);
    }
};
