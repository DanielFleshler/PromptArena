/**
 * Helper Utility Functions
 * Common utilities used throughout the application
 */

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in ms (will be multiplied)
 * @returns {Promise}
 */
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @param {number} decimals - Decimal places
 * @returns {number}
 */
function calculatePercentage(part, total, decimals = 0) {
  if (total === 0) return 0;
  return Number(((part / total) * 100).toFixed(decimals));
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/**
 * Sanitize GitHub username (remove invalid characters)
 * @param {string} username - GitHub username
 * @returns {string}
 */
function sanitizeUsername(username) {
  if (!username) return '';
  // GitHub usernames can only contain alphanumeric characters and hyphens
  return username.replace(/[^a-zA-Z0-9-]/g, '');
}

/**
 * Validate GitHub username format
 * @param {string} username - GitHub username to validate
 * @returns {boolean}
 */
function isValidGitHubUsername(username) {
  if (!username) return false;
  // GitHub usernames:
  // - Must be 1-39 characters
  // - Can contain alphanumeric and hyphens
  // - Cannot start/end with hyphen
  // - Cannot have consecutive hyphens
  const regex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
  return regex.test(username);
}

/**
 * Parse repository full name into owner and repo
 * @param {string} fullName - Repository full name (e.g., "owner/repo")
 * @returns {{owner: string, repo: string}}
 */
function parseRepoFullName(fullName) {
  const [owner, repo] = fullName.split('/');
  return { owner, repo };
}

/**
 * Calculate time ago from date
 * @param {Date|string} date - Date to calculate from
 * @returns {string}
 */
function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }

  return 'just now';
}

/**
 * Deep clone an object (simple implementation)
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean}
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

module.exports = {
  sleep,
  retryWithBackoff,
  formatBytes,
  calculatePercentage,
  truncate,
  sanitizeUsername,
  isValidGitHubUsername,
  parseRepoFullName,
  timeAgo,
  deepClone,
  isEmpty,
};
