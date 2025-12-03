/**
 * Slash Command: /submitproject
 * Description: Allows users to submit their hackathon project.
 * Options:
 * - url: The URL of the project (e.g., GitHub, Devpost) (required).
 */
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('submitproject')
        .setDescription('Submit your hackathon project')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('The URL to your project (GitHub/Devpost)')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        // Logic to save submission would go here
        await interaction.reply(`Project submitted! URL: ${url} (Mock)`);

        // DB Logging
        const db = require('../utils/db');
        await db.logData(interaction.client, interaction.user, 'Project Submission', `URL: ${url}`);
        await db.logAudit(interaction.client, interaction.user, 'Command Execution', `Executed /submitproject`);
    },
};
