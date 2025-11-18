class PriorityQueue {
	constructor() {
		this.elements = [];
	}
	isEmpty() {
		return this.elements.length === 0;
	}
	size() {
		return this.elements.length;
	}
	peek() {
		return this.elements.length > 0 ? this.elements[0] : null;
	}
	bubbleUp(index) {
		while (index > 0) {
			const parentIndex = Math.floor((index - 1) / 2);
			if (
				this.elements[parentIndex].priority >= this.elements[index].priority
			) {
				break;
			}
			[this.elements[parentIndex], this.elements[index]] = [
				this.elements[index],
				this.elements[parentIndex],
			];
			index = parentIndex;
		}
	}
	enqueue(job) {
		this.elements.push(job);
		this.bubbleUp(this.size() - 1);
	}

	bubbleDown(index) {
		const length = this.elements.length;
		const element = this.elements[index];
		while (true) {
			let leftChildIndex = 2 * index + 1;
			let rightChildIndex = 2 * index + 2;
			let swapIndex = null;

			if (leftChildIndex < length) {
				if (this.elements[leftChildIndex].priority > element.priority) {
					swapIndex = leftChildIndex;
				}
			}

			if (rightChildIndex < length) {
				if (
					(swapIndex === null &&
						this.elements[rightChildIndex].priority > element.priority) ||
					(swapIndex !== null &&
						this.elements[rightChildIndex].priority >
							this.elements[leftChildIndex].priority)
				) {
					swapIndex = rightChildIndex;
				}
			}

			if (swapIndex === null) break;

			this.elements[index] = this.elements[swapIndex];
			this.elements[swapIndex] = element;
			index = swapIndex;
		}
	}

	dequeue() {
		if (this.isEmpty()) {
			return null;
		}
		const highestPriorityJob = this.elements[0];
		const end = this.elements.pop();
		if (this.size() > 0) {
			this.elements[0] = end;
			this.bubbleDown(0);
		}
		return highestPriorityJob;
	}
}

module.exports = PriorityQueue;
