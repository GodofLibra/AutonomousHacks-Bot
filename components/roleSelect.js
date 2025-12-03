/**
 * Component: Role Selection Handler
 * Description: Handles interactions from the role selection dropdown menu.
 * Logic: Assigns 'Participant' or 'Mentor' role based on user selection.
 * 
 * Available Server Roles:
 * - Organizer
 * - Moderator
 * - Core Team
 * - Volunteers
 * - Judge
 * - Mentor
 * - Team Lead
 * - Participant
 */
const logger = require('../utils/logger');

module.exports = {
    customId: 'role_select',
    async execute(interaction) {
        const selectedRole = interaction.values[0];
        const roleName = selectedRole === 'participant' ? 'Participant' : 'Mentor';

        try {
            const role = interaction.guild.roles.cache.find(r => r.name === roleName);
            if (!role) {
                await interaction.reply({ content: `Role "${roleName}" not found on this server.`, ephemeral: true });
                return;
            }

            // Check if user already has the role
            if (interaction.member.roles.cache.has(role.id)) {
                await interaction.reply({ content: `You already have the **${roleName}** role!`, ephemeral: true });
                return;
            }

            await interaction.member.roles.add(role);
            await interaction.reply({ content: `Successfully assigned the **${roleName}** role!`, ephemeral: true });

            await logger(interaction.client, 'Role Assigned', `User ${interaction.user.tag} selected **${roleName}** role via menu.`, 0x00FF00);

            // DB Logging
            const db = require('../utils/db');
            await db.logAudit(interaction.client, interaction.user, 'Role Selection', `Self-assigned role: ${roleName}`, 0x00FF00);

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error assigning role.', ephemeral: true });
            await logger(interaction.client, 'Role Error', `Error assigning role to ${interaction.user.tag}: ${error.message}`, 0xFF0000);
        }
    }
};
