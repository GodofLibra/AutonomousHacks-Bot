/**
 * Utility: Channel-based Database & Audit Log
 * Description: Logs structured events to specific Discord channels.
 * Usage: 
 * - db.logAudit(client, user, action, details) -> Logs to AUDIT_CHANNEL_ID
 * - db.logData(client, user, type, data) -> Logs to DB_CHANNEL_ID
 */
const { EmbedBuilder } = require('discord.js');

module.exports = {
    /**
     * Logs high-level activity to the Audit Channel.
     */
    logAudit: async (client, user, action, details, color = 0x0099FF) => {
        try {
            const auditChannelId = process.env.AUDIT_CHANNEL_ID;
            if (!auditChannelId) {
                console.warn('AUDIT_CHANNEL_ID is not set in .env');
                return;
            }

            const channel = await client.channels.fetch(auditChannelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle(`🛡️ Audit Log: ${action}`)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'Action', value: action, inline: true },
                    { name: 'Details', value: details }
                )
                .setColor(color)
                .setTimestamp()
                .setFooter({ text: `User ID: ${user.id}` });

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error writing to Audit channel:', error);
        }
    },

    /**
     * Logs data records to the DB Channel.
     */
    logData: async (client, user, type, data, color = 0x00FF00) => {
        try {
            const dbChannelId = process.env.DB_CHANNEL_ID;
            if (!dbChannelId) {
                console.warn('DB_CHANNEL_ID is not set in .env');
                return;
            }

            const channel = await client.channels.fetch(dbChannelId);
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setTitle(`💾 Database Record: ${type}`)
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription(`**${type}**`)
                .addFields(
                    { name: 'User', value: `<@${user.id}>`, inline: true },
                    { name: 'Data', value: data }
                )
                .setColor(color)
                .setTimestamp();

            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error writing to DB channel:', error);
        }
    }
};
