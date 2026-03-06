import axios from 'axios';
import { retryWithExponentialBackoff, handleAxiosError } from '../utils/errorHandling';
import CircuitBreaker from '../utils/circuitBreaker';
import { generateIdempotencyKey, isIdempotencyKeyUsed } from '../utils/idempotency';
import deadLetterQueue from '../utils/deadLetterQueue';

const circuitBreaker = new CircuitBreaker();

export const createOrder = async (orderData: any) => {
  const idempotencyKey = generateIdempotencyKey();
  if (isIdempotencyKeyUsed(idempotencyKey)) {
    console.warn('Duplicate request detected');
    return;
  }

  try {
    await circuitBreaker.call(() =>
      retryWithExponentialBackoff(() =>
        axios.post('/api/orders', orderData, {
          headers: { 'Idempotency-Key': idempotencyKey }
        })
      )
    );
  } catch (error) {
    handleAxiosError(error);
    deadLetterQueue.add({ id: idempotencyKey, payload: orderData, reason: error.message });
  }
};