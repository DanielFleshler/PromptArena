const PriorityQueue = require("../../../src/queue/PriorityQueue");

console.log("Testing PriorityQueue...\n");

const queue = new PriorityQueue();

// Test 1: isEmpty on new queue
console.log("Test 1: isEmpty");
console.log("Expected: true, Got:", queue.isEmpty());
console.log("");

// Test 2: Add jobs
console.log("Test 2: Enqueue jobs");
queue.enqueue({ id: 1, type: "low", priority: 3 });
queue.enqueue({ id: 2, type: "high", priority: 8 });
queue.enqueue({ id: 3, type: "medium", priority: 5 });
console.log("Enqueued 3 jobs (priorities: 3, 8, 5)");
console.log("Size:", queue.size());
console.log("");

// Test 3: Peek
console.log("Test 3: Peek (should be priority 8)");
console.log("Peeked:", queue.peek());
console.log("");

// Test 4: Dequeue in priority order
console.log("Test 4: Dequeue in priority order");
console.log("1st dequeue (should be 8):", queue.dequeue());
console.log("2nd dequeue (should be 5):", queue.dequeue());
console.log("3rd dequeue (should be 3):", queue.dequeue());
console.log("4th dequeue (should be null):", queue.dequeue());
console.log("");

// Test 5: Complex scenario
console.log("Test 5: Realistic job scenario");
queue.enqueue({ type: "analyze-repo", priority: 5 });
queue.enqueue({ type: "fetch-profile", priority: 10 });
queue.enqueue({ type: "analyze-repo", priority: 5 });
queue.enqueue({ type: "fetch-repos", priority: 9 });
queue.enqueue({ type: "generate-portfolio", priority: 1 });

console.log("Processing order:");
while (!queue.isEmpty()) {
	const job = queue.dequeue();
	console.log(`  Priority ${job.priority}: ${job.type}`);
}

console.log("\nAll tests completed!");
