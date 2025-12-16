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
                    .setValue('Participant'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Volunteers')
                    .setDescription('Join as a volunteer')
                    .setValue('Volunteers'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Team Lead')
                    .setDescription('Join as a team lead')
                    .setValue('Team Lead'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Mentor')
                    .setDescription('Join as a mentor')
                    .setValue('Mentor'),
            );

        const row = new ActionRowBuilder()
            .addComponents(select);

        await interaction.reply({
            content: 'Choose your role!',
            components: [row],
        });
    }
};
