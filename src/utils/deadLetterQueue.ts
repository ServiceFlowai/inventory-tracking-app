interface DeadLetterQueueItem {
  id: string;
  payload: any;
  reason: string;
}

class DeadLetterQueue {
  private queue: DeadLetterQueueItem[] = [];

  public add(item: DeadLetterQueueItem) {
    this.queue.push(item);
    console.warn('Added to Dead Letter Queue:', item);
  }

  public process() {
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      console.log('Processing item from Dead Letter Queue:', item);
      // Implement reprocessing logic here
    }
  }
}

export default new DeadLetterQueue();