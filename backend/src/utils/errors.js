/**
 * Custom Error Classes
 * Provides specific error types for better error handling
 */

/**
 * Base application error
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes operational errors from programming errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Database-related errors
 */
class DatabaseError extends AppError {
  constructor(message) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

/**
 * Validation errors (bad user input)
 */
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Not found errors
 */
class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * GitHub API errors
 */
class GitHubAPIError extends AppError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
    this.name = 'GitHubAPIError';
  }
}

/**
 * Job execution errors
 */
class JobExecutionError extends AppError {
  constructor(message, jobId) {
    super(message, 500);
    this.name = 'JobExecutionError';
    this.jobId = jobId;
  }
}

/**
 * Rate limit errors
 */
class RateLimitError extends AppError {
  constructor(message, retryAfter) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

module.exports = {
  AppError,
  DatabaseError,
  ValidationError,
  NotFoundError,
  GitHubAPIError,
  JobExecutionError,
  RateLimitError,
};
