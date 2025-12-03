/**
 * Test Runner for AutonomousHacks Bot
 * Description: Runs unit tests using mock Discord objects.
 * Usage: node testcases.js
 */

const assert = require('assert');
const path = require('path');

// --- MOCKS ---

class MockCollection extends Map {
    find(fn) {
        for (const [key, val] of this) {
            if (fn(val, key, this)) return val;
        }
        return undefined;
    }
}

class MockUser {
    constructor(id, tag) {
        this.id = id;
        this.tag = tag;
        this.bot = false;
    }
    displayAvatarURL() { return 'http://mock.url/avatar.png'; }
}

class MockRole {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class MockMember {
    constructor(user, roles = []) {
        this.user = user;
        this.roles = {
            cache: new MockCollection(roles.map(r => [r.id, r])),
            add: async (role) => { this.roles.cache.set(role.id, role); return this; },
            has: (id) => this.roles.cache.has(id)
        };
        this.guild = null; // Set later if needed
        this.moderatable = true;
        this.timedOutUntil = null;
    }

    async timeout(duration, reason) {
        this.timedOutUntil = Date.now() + duration;
        return this;
    }
}

class MockChannel {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.sentMessages = [];
    }
    async send(content) {
        this.sentMessages.push(content);
        return { content }; // Mock return
    }
}

class MockGuild {
    constructor(id) {
        this.id = id;
        this.roles = {
            cache: new MockCollection(),
            fetch: async () => this.roles.cache
        };
        this.members = {
            cache: new MockCollection()
        };
    }
}

class MockClient {
    constructor() {
        this.user = new MockUser('bot_id', 'Bot#0000');
        this.channels = {
            cache: new MockCollection(),
            fetch: async (id) => this.channels.cache.get(id)
        };
    }
}

class MockInteraction {
    constructor(client, user, commandName, options = {}) {
        this.client = client;
        this.user = user;
        this.commandName = commandName;
        this.options = {
            getString: (name) => options[name] || null,
            getInteger: (name) => options[name] || null
        };
        this.replied = false;
        this.deferred = false;
        this.replies = [];
    }

    async reply(content) {
        this.replied = true;
        this.replies.push(content);
    }

    async followUp(content) {
        this.replies.push(content);
    }
}

class MockMessage {
    constructor(client, author, channel, content) {
        this.client = client;
        this.author = author;
        this.channel = channel;
        this.content = content;
        this.deleted = false;
    }

    async delete() {
        this.deleted = true;
    }
}

// --- SETUP ---
const client = new MockClient();
const dbChannel = new MockChannel('db_id', 'db-logs');
const auditChannel = new MockChannel('audit_id', 'audit-logs');

// Mock Environment
process.env.DB_CHANNEL_ID = 'db_id';
process.env.AUDIT_CHANNEL_ID = 'audit_id';

client.channels.cache.set('db_id', dbChannel);
client.channels.cache.set('audit_id', auditChannel);

// --- TESTS ---

async function runTests() {
    console.log('🚀 Starting Tests...\n');
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
        try {
            await fn();
            console.log(`✅ PASS: ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ FAIL: ${name}`);
            console.error(error);
            failed++;
        }
    }

    // 1. Test Moderation Utility
    await test('Moderation: Detect Banned Words', async () => {
        const moderation = require('./utils/moderation');
        assert.strictEqual(moderation.containsBannedContent('This is safe'), false);
        assert.strictEqual(moderation.containsBannedContent('This contains nsfw content'), true);
    });

    await test('Moderation: Detect Spam', async () => {
        const moderation = require('./utils/moderation');
        const userId = 'spammer_1';
        assert.strictEqual(moderation.isSpam(userId, 'spam'), false); // 1st
        assert.strictEqual(moderation.isSpam(userId, 'spam'), false); // 2nd
        assert.strictEqual(moderation.isSpam(userId, 'spam'), true);  // 3rd (Burst)
    });

    // 2. Test Command: createTeam
    await test('Command: createTeam', async () => {
        const createTeam = require('./commands/createTeam');
        const user = new MockUser('u1', 'User#1234');
        const interaction = new MockInteraction(client, user, 'createteam', { name: 'Hackers' });

        try {
            await createTeam.execute(interaction);
        } catch (e) {
            console.error('Error executing createTeam:', e);
        }

        console.log('Interaction Replies:', JSON.stringify(interaction.replies, null, 2));
        assert.strictEqual(interaction.replied, true, 'Interaction should have been replied to');
        if (interaction.replies.length > 0) {
            // Check if content is an object (ephemeral) or string
            const reply = interaction.replies[0];
            const content = typeof reply === 'string' ? reply : reply.content;
            assert.ok(content.includes('Team **Hackers** created'), 'Reply content mismatch');
        } else {
            assert.fail('No replies sent');
        }
    });

    // 3. Test Event: messageCreate (Moderation)
    await test('Event: messageCreate (Banned Word)', async () => {
        const messageCreate = require('./events/messageCreate');
        const user = new MockUser('u2', 'BadUser#1234');
        const channel = new MockChannel('c1', 'general');
        const message = new MockMessage(client, user, channel, 'Do not post nsfw here');

        // Attach member to message for timeout testing
        const member = new MockMember(user);
        message.member = member;

        await messageCreate.execute(message);

        assert.strictEqual(message.deleted, true, 'Message should be deleted');
        assert.strictEqual(channel.sentMessages.length, 1, 'Warning should be sent');
        assert.ok(channel.sentMessages[0].includes('muted for 5 minutes'), 'Warning should mention mute');
        assert.ok(member.timedOutUntil > Date.now(), 'User should be timed out');
    });

    // 4. Test Event: guildMemberAdd (Auto Role)
    await test('Event: guildMemberAdd', async () => {
        const guildMemberAdd = require('./events/guildMemberAdd');
        const user = new MockUser('u3', 'Newbie#1234');
        const member = new MockMember(user);

        // Setup Guild and Role
        const guild = new MockGuild('g1');
        const role = new MockRole('r1', 'Participant');
        guild.roles.cache.set('r1', role);
        member.guild = guild;
        member.client = client; // Attach client for logging

        await guildMemberAdd.execute(member);

        assert.ok(member.roles.cache.has('r1'), 'Participant role should be assigned');
    });

    // 5. Test Command: activate
    await test('Command: activate', async () => {
        const activate = require('./commands/activate');
        const user = new MockUser('u4', 'ActiveUser#1234');
        const member = new MockMember(user);
        const interaction = new MockInteraction(client, user, 'activate');

        // Setup Guild and Role
        const guild = new MockGuild('g1');
        const role = new MockRole('r1', 'Participant');
        guild.roles.cache.set('r1', role);

        interaction.guild = guild;
        interaction.member = member;
        member.guild = guild; // Ensure member has guild ref

        await activate.execute(interaction);

        assert.strictEqual(interaction.replied, true, 'Should reply to interaction');
        assert.ok(member.roles.cache.has('r1'), 'Participant role should be assigned');
        assert.ok(interaction.replies[0].content.includes('Successfully activated'), 'Success message mismatch');
    });

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
}

runTests();
