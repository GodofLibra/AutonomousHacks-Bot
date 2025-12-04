# AutonomousHacks Bot 🤖

A robust, modular, and feature-rich Discord bot designed for hackathon management, automated moderation, and comprehensive audit logging. Built with **Node.js** and **discord.js**.

## ✨ Key Features

### 🛡️ Moderation & Security
-   **Auto-Moderation**: Automatically detects and deletes messages containing **NSFW**, **Gore**, or **Profanity**.
-   **Anti-Spam**: Detects and warns users sending rapid duplicate messages (burst spam protection).
-   **Audit Logging**: Logs all significant events (Commands, Role Changes, Moderation Actions) to a dedicated Discord channel with structured Embeds.

### 👥 User Management
-   **Auto-Role**: Automatically assigns the **"Participant"** role to new members upon joining.
-   **Role Selection Menu**: Interactive dropdown menu for users to self-assign roles (e.g., Participant, Mentor).

### 🛠️ Hackathon Tools
-   **/createteam**: Create a new team for the hackathon.
-   **/submitproject**: Submit a project link for judging.
-   **/scoreteam** *(Admin)*: Score a team's project.
-   **/setuproles** *(Admin)*: Deploy the interactive role selection menu.

### ⚙️ Architecture
-   **Modular Design**: Clean separation of Commands, Events, Utilities, and Components.
-   **Test Suite**: Built-in standalone test runner (`testcases.js`) using mock objects.

### 💻 Tech Stack
-   **Runtime**: Node.js
-   **Framework**: discord.js (v14)
-   **Configuration**: dotenv

---

## 🚀 Installation & Setup

### Prerequisites
-   **Node.js** (v16.9.0 or higher)
-   **npm** (Node Package Manager)
-   A Discord Bot Token (from the [Discord Developer Portal](https://discord.com/developers/applications))

### 1. Clone the Repository
```bash
git clone https://github.com/GodofLibra/AutonomousHacks-Bot.git
cd autonomoushacks-bot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configuration
Create a `.env` file in the root directory (or copy `.env.sample`):
```bash
cp .env.sample .env
```
Fill in your details:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
LOG_CHANNEL_ID=channel_id_for_console_logs
DB_CHANNEL_ID=channel_id_for_audit_logs
```

### 4. Deploy Commands
Register the slash commands with Discord:
```bash
node deploy-commands.js
```
*Note: The `/createteam` command is managed separately. To deploy it:*
```bash
node manage-createteam.js deploy
```

### 5. Run the Bot
```bash
node index.js
```

---

## 🧪 Testing
The project includes a standalone test runner that simulates Discord interactions to verify bot logic without a live connection.

Run the tests:
```bash
node testcases.js
```
**Coverage**:
-   Moderation Filters (Banned words, Spam)
-   Command Logic (`/createteam`)
-   Event Handlers (`messageCreate`, `guildMemberAdd`)

---

## 📂 Project Structure
```
├── commands/           # Slash command definitions
│   ├── activate.js     # /activate command
│   ├── createTeam.js   # /createteam command
│   ├── scoreTeam.js    # /scoreteam command
│   ├── setupRoles.js   # /setuproles command
│   └── submitProject.js # /submitproject command
├── components/         # Interactive components
│   └── roleSelect.js   # Role selection menu handler
├── events/             # Event handlers
│   ├── guildMemberAdd.js
│   ├── interactionCreate.js
│   ├── messageCreate.js
│   ├── messageDelete.js
│   ├── messageUpdate.js
│   └── ready.js
├── utils/              # Utility modules
│   ├── db.js           # Database/Audit logging
│   ├── logger.js       # General logging
│   └── moderation.js   # Content filtering
├── index.js            # Main entry point
├── deploy-commands.js  # Command registration script
├── manage-createteam.js # Manual deployment for /createteam
├── testcases.js        # Unit testing suite
├── guide.md            # Developer guide
├── implementation.md   # Implementation history
├── Readme.md           # Project documentation
└── .env                # Configuration secrets
```

## Authors

- [@Harshil Shah](https://github.com/GodofLibra)

## 📚 Additional Documentation

### [Developer Guide](guide.md)
**Significance**: The primary manual for developers and administrators maintaining the bot.
**Usage**: Refer to this for:
-   Detailed Architecture Overview.
-   Step-by-step Developer Workflows (Adding commands, events).
-   Troubleshooting common issues.

### [Implementation Log](implementation.md)
**Significance**: A historical record of the project's development phases.
**Usage**: Use this to:
-   Track the evolution of features (from Phase 1 to present).
-   Understand the rationale behind architectural decisions.
-   Review verification steps for each phase.

## 📝 License
This project is licensed under the MIT License.
