/**
 * Slash Command: /createteam
 * Description: Allows users to create a new hackathon team.
 * Options:
 * - name: The name of the team (required).
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createteam')
        .setDescription('Create a new hackathon team')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of your team')
                .setRequired(true)),
    async execute(interaction) {
        const teamName = interaction.options.getString('name');
        // Logic to create team in DB would go here
        await interaction.reply(`Team **${teamName}** created successfully! (Mock)`);
    },
};
