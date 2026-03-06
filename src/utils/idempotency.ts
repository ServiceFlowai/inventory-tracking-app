import { v4 as uuidv4 } from 'uuid';

const idempotencyKeys = new Set<string>();

export const generateIdempotencyKey = (): string => {
  const key = uuidv4();
  idempotencyKeys.add(key);
  return key;
};

export const isIdempotencyKeyUsed = (key: string): boolean => {
  return idempotencyKeys.has(key);
};