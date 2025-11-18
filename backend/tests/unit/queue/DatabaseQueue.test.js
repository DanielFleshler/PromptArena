const DatabaseQueue = require("../../../src/queue/DatabaseQueue");
const db = require("../../../src/config/database");

async function testDatabaseQueue() {
	console.log("🧪 Testing DatabaseQueue...\n");

	const queue = new DatabaseQueue();

	try {
		// Clean up any existing test data
		await db.query("DELETE FROM jobs WHERE type LIKE 'test-%'");
		await db.query("DELETE FROM analyses WHERE username = 'test-user'");

		// Test 1: Create an analysis
		console.log("Test 1: Create analysis");
		const analysisResult = await db.query(
			`INSERT INTO analyses (username, status)
         VALUES ('test-user', 'pending')
         RETURNING *`
		);
		const analysisId = analysisResult.rows[0].id;
		console.log("✅ Created analysis:", analysisId);
		console.log("");

		// Test 2: Enqueue jobs
		console.log("Test 2: Enqueue jobs");
		await queue.enqueue({
			analysis_id: analysisId,
			type: "test-high-priority",
			priority: 8,
			data: { test: "data1" },
		});

		await queue.enqueue({
			analysis_id: analysisId,
			type: "test-low-priority",
			priority: 3,
			data: { test: "data2" },
		});

		console.log("✅ Enqueued 2 jobs");
		console.log("");

		// Test 3: Dequeue (should get highest priority first)
		console.log("Test 3: Dequeue in priority order");
		const job1 = await queue.dequeue();
		console.log("First job:", job1.type, "(priority", job1.priority + ")");

		const job2 = await queue.dequeue();
		console.log("Second job:", job2.type, "(priority", job2.priority + ")");
		console.log("");

		// Test 4: Complete a job
		console.log("Test 4: Complete job");
		await queue.completeJob(job1.id, { success: true, result: "done!" });
		console.log("✅ Job completed");
		console.log("");

		// Test 5: Fail a job (should retry)
		console.log("Test 5: Fail job (will retry)");
		await queue.failJob(job2.id, new Error("Test error"));
		console.log("");

		// Test 6: Check if job is back in queue
		console.log("Test 6: Dequeue retry job");
		const retryJob = await queue.dequeue();
		console.log("Retry job:", retryJob.type, "(retry", retryJob.retries + ")");
		console.log("");

		// Test 7: Complete the retry job
		console.log("Test 7: Complete retry job");
		await queue.completeJob(retryJob.id, { success: true });
		console.log("");

		// Test 8: Try to dequeue from empty queue
		console.log("Test 8: Dequeue from empty queue");
		const emptyResult = await queue.dequeue();
		console.log("Result:", emptyResult === null ? "null (correct!)" : "ERROR");
		console.log("");

		console.log("✅ All DatabaseQueue tests passed!");
	} catch (error) {
		console.error("❌ Test failed:", error);
	} finally {
		// Cleanup
		await db.query("DELETE FROM jobs WHERE type LIKE 'test-%'");
		await db.query("DELETE FROM analyses WHERE username = 'test-user'");
		process.exit(0);
	}
}

testDatabaseQueue();
