# Bot Developer Guide

This document provides a comprehensive guide to the bot's architecture, configuration, and workflows. It is intended for developers and administrators maintaining the bot.

## Architecture Overview

The bot uses a modular architecture to separate concerns and improve scalability.

### Directory Structure

-   **`commands/`**: Contains Slash Command definitions.
    -   `createTeam.js`: Logic for creating hackathon teams.
    -   `scoreTeam.js`: Admin-only command for scoring projects.
    -   `setupRoles.js`: Admin-only command to send the role selection menu.
    -   `submitProject.js`: Logic for project submissions.
-   **`events/`**: Contains Event Handlers.
    -   `ready.js`: Triggered on bot startup.
    -   `interactionCreate.js`: Routes commands and component interactions.
    -   `guildMemberAdd.js`: Auto-assigns roles to new members.
    -   `messageCreate.js`: Monitors messages for moderation.
    -   `messageDelete.js` & `messageUpdate.js`: Logging events.
-   **`components/`**: Contains interactive component handlers.
    -   `roleSelect.js`: Handles logic for the role selection dropdown.
-   **`utils/`**: Utility modules.
    -   `logger.js`: Centralized logging to a Discord channel.
    -   `moderation.js`: Content filtering and spam detection logic.
    -   `db.js`: Database connection placeholder.

### Tech Stack
-   **Runtime**: Node.js
-   **Framework**: discord.js (v14)
-   **Configuration**: dotenv

## Configuration & Setup

### 1. Environment Variables (`.env`)
Ensure the following variables are set:
```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
LOG_CHANNEL_ID=your_logging_channel_id
```

### 2. Discord Developer Portal
-   **Intents**: Enable `SERVER MEMBERS INTENT`, `MESSAGE CONTENT INTENT`, and `GUILD MESSAGES`.
-   **OAuth2**: Ensure the bot is invited with `bot` and `applications.commands` scopes.

### 3. Server Roles
-   Create roles named **Participant** and **Mentor**.
-   Ensure the bot's role is **higher** than these roles in the hierarchy.

## Developer Workflows

### Workflow: Adding a New Command
1.  Create a new file in `commands/` (e.g., `ping.js`).
2.  Export a `SlashCommandBuilder` object as `data`.
3.  Export an `execute(interaction)` function.
4.  Run `node deploy-commands.js` to register the new command.
5.  Restart the bot.

### Workflow: Adding a New Event
1.  Create a new file in `events/` (e.g., `channelCreate.js`).
2.  Export `name` (event name) and `execute(...args)` function.
3.  The bot automatically loads it on restart.

### Workflow: Deploying Changes
1.  **Standard Commands**: Run `node deploy-commands.js` to update most commands.
2.  **CreateTeam Command**: This command is managed separately.
    -   **Deploy**: `node manage-createteam.js deploy`
    -   **Undeploy**: `node manage-createteam.js undeploy`
3.  **Logic**: If you only changed code logic, just restart the bot:
    ```bash
    node index.js
    ```

## Troubleshooting

-   **Command Not Found**: Did you run `deploy-commands.js`?
-   **Role Error**: Check if the role exists and the bot has `Manage Roles` permission.
-   **Logs Not Appearing**: Check `LOG_CHANNEL_ID` in `.env` and bot permissions in that channel.
