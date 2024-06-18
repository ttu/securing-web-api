import { cacheLocal } from './cache/cacheLocal';
import { cacheRedis } from './cache/cacheRedis';

const cache = process.env.CACHE === 'redis' ? cacheRedis : cacheLocal;

export const add = <T>(key: string, value: T) => cache.add(key, value);

export const get = <T>(key: string): Promise<T | undefined> => cache.get(key);
