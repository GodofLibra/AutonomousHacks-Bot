/**
 * Event: guildMemberAdd
 * Description: Triggered when a new user joins the server.
 * Action: Automatically assigns the 'Participant' role to the new member.
 */
const logger = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const roleName = 'Participant';
            const role = member.guild.roles.cache.find(r => r.name === roleName);

            if (!role) {
                console.error(`Role "${roleName}" not found.`);
                await logger(member.client, 'Role Error', `Role "${roleName}" not found.`, 0xFF0000);
                return;
            }

            await member.roles.add(role);
            console.log(`Assigned role "${roleName}" to ${member.user.tag}.`);
            await logger(member.client, 'Member Joined', `Assigned role "${roleName}" to ${member.user.tag}.`, 0x00FF00);

            // DB Logging
            const db = require('../utils/db');
            await db.logAudit(member.client, member.user, 'Member Joined', `Joined server and assigned role: ${roleName}`, 0x00FF00);
        } catch (error) {
            console.error(`Error assigning role to ${member.user.tag}:`, error);
            await logger(member.client, 'Error', `Error assigning role to ${member.user.tag}: ${error.message}`, 0xFF0000);
        }
    },
};
