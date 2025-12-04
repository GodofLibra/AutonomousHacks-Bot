/**
 * Slash Command: /setuproles
 * Description: Sends a role selection menu to the channel.
 * Usage: Users select a role from the dropdown to be assigned that role.
 */
const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setuproles')
        .setDescription('Send the role selection menu')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const select = new StringSelectMenuBuilder()
            .setCustomId('role_select')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Participant')
                    .setDescription('Join as a participant')
                    .setValue('participant'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Choose your role!',
            components: [row],
        });
    }
};
