/**
 * Utility: Console Logger
 * Description: Overrides default console methods to include UTC timestamps and log to file.
 */

const fs = require('fs');
const path = require('path');

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

const logFilePath = path.join(process.cwd(), 'Project logging', 'app.log');

function getTimestamp() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(now.getUTCMilliseconds()).padStart(3, '0');

    return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}]`;
}

function logToFile(message) {
    try {
        fs.appendFileSync(logFilePath, message + '\n');
    } catch (err) {
        originalError('Failed to write to log file:', err);
    }
}

console.log = (...args) => {
    const timestamp = getTimestamp();
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
    const logMessage = `${timestamp} ${message}`;

    originalLog(timestamp, ...args);
    logToFile(logMessage);
};

console.warn = (...args) => {
    const timestamp = getTimestamp();
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
    const logMessage = `${timestamp} [WARN] ${message}`;

    originalWarn(timestamp, ...args);
    logToFile(logMessage);
};

console.error = (...args) => {
    const timestamp = getTimestamp();
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
    const logMessage = `${timestamp} [ERROR] ${message}`;

    originalError(timestamp, ...args);
    logToFile(logMessage);
};

module.exports = {
    originalLog,
    originalWarn,
    originalError
};
