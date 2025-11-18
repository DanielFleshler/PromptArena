/**
 * Logger Utility
 * Provides colored console logging for better readability
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function timestamp() {
  return new Date().toISOString();
}

const logger = {
  /**
   * General information
   */
  info: (message, ...args) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
  },

  /**
   * Success messages
   */
  success: (message, ...args) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
  },

  /**
   * Warning messages
   */
  warn: (message, ...args) => {
    console.warn(`${colors.yellow}[WARN]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
  },

  /**
   * Error messages
   */
  error: (message, ...args) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
  },

  /**
   * Debug messages (only in development)
   */
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}[DEBUG]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
    }
  },

  /**
   * Worker-specific logs
   */
  worker: (workerId, message, ...args) => {
    console.log(`${colors.cyan}[WORKER ${workerId}]${colors.reset} ${colors.gray}${timestamp()}${colors.reset} - ${message}`, ...args);
  },
};

module.exports = logger;
