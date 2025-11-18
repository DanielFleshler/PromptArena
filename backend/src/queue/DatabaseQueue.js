const db = require("../config/database.js");
const logger = require("../utils/logger");

class DatabaseQueue {
	async enqueue(jobData) {
		const {
			analysis_id,
			type,
			priority = 5,
			data = {},
			max_retries = 3,
		} = jobData;

		try {
			const result = await db.query(
				`INSERT INTO jobs (analysis_id, type, priority, data, max_retries)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
				[analysis_id, type, priority, JSON.stringify(data), max_retries]
			);
			logger.info(`Enqueued job with ID: ${result.rows[0].id}`);
			return result.rows[0];
		} catch (error) {
			logger.error("Error enqueueing job:", error);
			throw error;
		}
	}
	async dequeue() {
		try {
			const result = await db.query(`
                UPDATE jobs
                SET 
                status = 'processing',
                started_at = NOW()
                WHERE id = (
                SELECT id 
                FROM jobs
                WHERE status = 'pending'
                ORDER BY priority DESC, created_at ASC
                LIMIT 1
                FOR UPDATE SKIP LOCKED
                )
                RETURNING *
            `);
			if (result.rows.length === 0) {
				logger.info("No pending jobs to dequeue.");
				return null;
			}

			const job = result.rows[0];
			logger.info(
				`Dequeued job: ${job.type} (priority ${job.priority}, ID: ${job.id})`
			);
			return job;
		} catch (error) {
			logger.error("Error dequeuing job:", error);
			throw error;
		}
	}
	async completeJob(jobId, result = {}) {
		try {
			await db.query(
				`
                UPDATE jobs
                SET
                    status = 'completed',
                    result = $2,
                    completed_at = NOW()
                WHERE id = $1
                `,
				[jobId, JSON.stringify(result)]
			);
			logger.success(`Job completed: ${jobId}`);
		} catch (error) {
			logger.error("Error completing job:", error);
			throw error;
		}
	}
	async failJob(jobId, error) {
		try {
			const jobResult = await db.query(
				"SELECT retries, max_retries FROM jobs WHERE id = $1",
				[jobId]
			);

			if (jobResult.rows.length === 0) {
				throw new Error(`Job ${jobId} not found`);
			}

			const job = jobResult.rows[0];
			const newRetries = job.retries + 1;

			if (newRetries < job.max_retries) {
				await db.query(
					`
                    UPDATE jobs
                    SET
                        status = 'pending',
                        retries = $2,
                        started_at = NULL
                    WHERE id = $1
                    `,
					[jobId, newRetries]
				);
				logger.warn(
					`Job will retry (${newRetries}/${job.max_retries}): ${jobId}`
				);
			} else {
				await db.query(
					`
                    UPDATE jobs
                    SET
                        status = 'failed',
                        error = $2,
                        completed_at = NOW()
                    WHERE id = $1
                    `,
					[jobId, error.message]
				);

				logger.error(`Job failed permanently: ${jobId}`);
			}
		} catch (error) {
			logger.error("Error failing job:", error);
			throw error;
		}
	}
}
module.exports = DatabaseQueue;
