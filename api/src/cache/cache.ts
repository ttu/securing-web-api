import { cacheLocal } from './cacheLocal';
import { cacheRedis } from './cacheRedis';

const CACHE_DURATION_IN_SEC = 10;

const cache = process.env.CACHE === 'redis' ? cacheRedis : cacheLocal;

export const add = <T>(key: string, value: T, durationInSec: number = CACHE_DURATION_IN_SEC) =>
  cache.add(key, value, durationInSec);

export const get = <T>(key: string): Promise<T | undefined> => cache.get(key);
