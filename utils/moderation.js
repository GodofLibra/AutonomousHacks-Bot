/**
 * Utility: Moderation Logic
 * Description: Contains lists of banned words and logic to check messages for violations.
 */

const bannedWords = [
    // NSFW / Explicit
    'nsfw', 'porn', 'xxx', 'hentai',
    // Gore / Violence
    'gore', 'kill', 'murder', 'blood',
    // Profanity (Example list - extend as needed)
    'badword1', 'badword2'
];

const spamMap = new Map();

module.exports = {
    /**
     * Checks if a message contains banned content.
     * @param {string} content - The message content.
     * @returns {boolean} - True if banned content is found.
     */
    containsBannedContent: (content) => {
        const lowerContent = content.toLowerCase();
        return bannedWords.some(word => lowerContent.includes(word));
    },

    /**
     * Checks for spam (basic implementation: duplicate messages).
     * @param {string} userId - The ID of the user.
     * @param {string} content - The message content.
     * @returns {boolean} - True if spam is detected.
     */
    isSpam: (userId, content) => {
        const now = Date.now();
        const userData = spamMap.get(userId) || { lastMessage: '', count: 0, timestamp: now };

        if (userData.lastMessage === content && (now - userData.timestamp) < 5000) {
            userData.count++;
            userData.timestamp = now;
            spamMap.set(userId, userData);

            if (userData.count >= 3) return true; // 3 duplicate messages in 5 seconds
        } else {
            spamMap.set(userId, { lastMessage: content, count: 1, timestamp: now });
        }

        return false;
    }
};
