const logger = require("../utils/logger");
const { Pool } = require("pg");
require("dotenv").config();

// Create connection pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 20,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on("error", (err) => {
	logger.error("Unexpected database pool error:", err);
	process.exit(-1);
});

// Test connection on startup
pool.query("SELECT NOW()", (err, res) => {
	if (err) {
		logger.error("Database connection failed:", err.message);
		process.exit(-1);
	} else {
		logger.info("Database connected successfully");
	}
});

// Export pool for use in other files
module.exports = {
	query: (text, params) => pool.query(text, params),
	pool,
};
