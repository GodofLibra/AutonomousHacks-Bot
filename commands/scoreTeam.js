/**
 * Slash Command: /scoreteam
 * Description: Allows administrators to score a team's project.
 * Permissions: Administrator only.
 * Options:
 * - team: The name of the team to score (required).
 * - score: The score to assign (0-100) (required).
 */
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('scoreteam')
        .setDescription('Score a team project')
        .addStringOption(option =>
            option.setName('team')
                .setDescription('The team name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('score')
                .setDescription('Score (0-100)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const team = interaction.options.getString('team');
        const score = interaction.options.getInteger('score');
        // Logic to save score would go here
        await interaction.reply(`Team **${team}** scored: **${score}/100** (Mock)`);

        // DB Logging
        const db = require('../utils/db');
        await db.logData(interaction.client, interaction.user, 'Team Score', `Team: ${team}, Score: ${score}`);
        await db.logAudit(interaction.client, interaction.user, 'Command Execution', `Executed /scoreteam`);
    },
};
