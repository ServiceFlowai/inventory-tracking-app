import axios, { AxiosError } from 'axios';

export const retryWithExponentialBackoff = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      const backoffDelay = delay * Math.pow(2, attempt);
      await new Promise(res => setTimeout(res, backoffDelay));
      attempt++;
    }
  }
};

export const handleAxiosError = (error: AxiosError) => {
  if (error.response) {
    console.error('Response error:', error.response.data);
  } else if (error.request) {
    console.error('Request error:', error.request);
  } else {
    console.error('Error:', error.message);
  }
};