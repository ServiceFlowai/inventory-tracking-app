class CircuitBreaker {
  private failureCount: number;
  private successCount: number;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly timeout: number;
  private nextAttempt: number;

  constructor(failureThreshold = 5, successThreshold = 2, timeout = 5000) {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.timeout = timeout;
    this.nextAttempt = Date.now();
  }

  public async call(fn: () => Promise<any>) {
    if (this.state === 'OPEN') {
      if (this.nextAttempt <= Date.now()) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit is open');
      }
    }

    try {
      const result = await fn();
      this.success();
      return result;
    } catch (error) {
      this.fail();
      throw error;
    }
  }

  private success() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.successCount = 0;
      }
    }
  }

  private fail() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

export default CircuitBreaker;