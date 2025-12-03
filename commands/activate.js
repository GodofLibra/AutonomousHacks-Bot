/**
 * Slash Command: /activate
 * Description: Manually assigns the 'Participant' role to the user.
 */
const { SlashCommandBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('activate')
        .setDescription('Activate your account and get the Participant role'),
    async execute(interaction) {
        const roleName = 'Participant';
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            await interaction.reply({ content: `Error: Role "${roleName}" not found on this server.`, ephemeral: true });
            return;
        }

        if (interaction.member.roles.cache.has(role.id)) {
            await interaction.reply({ content: `You already have the **${roleName}** role!`, ephemeral: true });
            return;
        }

        try {
            await interaction.member.roles.add(role);
            await interaction.reply({ content: `Successfully activated! You have been given the **${roleName}** role.`, ephemeral: true });

            // DB Logging
            const db = require('../utils/db');
            await db.logAudit(interaction.client, interaction.user, 'Role Assigned', `User used /activate to get ${roleName}`);

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while assigning the role.', ephemeral: true });
            await logger(interaction.client, 'Role Error', `Failed to assign ${roleName} to ${interaction.user.tag}: ${error.message}`, 0xFF0000);
        }
    },
};
