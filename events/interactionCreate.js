/**
 * Event: interactionCreate
 * Description: Triggered when a user interacts with the bot (slash commands, buttons, select menus).
 * Action: Routes the interaction to the appropriate command or component handler.
 */
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle Chat Commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
                await logger(interaction.client, 'Command Executed', `User ${interaction.user.tag} executed /${interaction.commandName}`, 0x0000FF);

                // DB Logging
                const db = require('../utils/db');
                await db.logAudit(interaction.client, interaction.user, 'Command Execution', `Executed command: /${interaction.commandName}`);
            } catch (error) {
                console.error(error);
                await logger(interaction.client, 'Command Error', `Error executing /${interaction.commandName}: ${error.message}`, 0xFF0000);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
        // Handle Select Menus
        else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'role_select') {
                const roleSelectHandler = require('../components/roleSelect');
                await roleSelectHandler.execute(interaction);
            }
        }
    },
};
