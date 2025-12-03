/**
 * Script: Manage CreateTeam Command
 * Description: Manually deploys or undeploys the 'createteam' command.
 * Usage: 
 *   node manage-createteam.js deploy
 *   node manage-createteam.js undeploy
 */
const { REST, Routes } = require('discord.js');
require('dotenv').config();
const path = require('path');

const action = process.argv[2];

if (!action || (action !== 'deploy' && action !== 'undeploy')) {
    console.error('Usage: node manage-createteam.js <deploy|undeploy>');
    process.exit(1);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
const clientId = process.env.CLIENT_ID;

(async () => {
    try {
        if (action === 'deploy') {
            const command = require(path.join(__dirname, 'commands', 'createTeam.js'));
            console.log('Deploying createTeam command...');

            await rest.post(
                Routes.applicationCommands(clientId),
                { body: command.data.toJSON() },
            );

            console.log('Successfully deployed createTeam command.');
        } else if (action === 'undeploy') {
            console.log('Fetching existing commands...');
            const commands = await rest.get(Routes.applicationCommands(clientId));
            const command = commands.find(cmd => cmd.name === 'createteam');

            if (!command) {
                console.log('Command createTeam not found.');
                return;
            }

            console.log(`Deleting command ${command.name} (${command.id})...`);
            await rest.delete(Routes.applicationCommand(clientId, command.id));
            console.log('Successfully undeployed createTeam command.');
        }
    } catch (error) {
        console.error(error);
    }
})();
