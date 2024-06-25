import memoryCache from 'memory-cache';

const memCache = new memoryCache.Cache<string, any>();

const add = <T>(key: string, value: T, durationInSec: number) => {
  const a = memCache.put(key, value, durationInSec * 1000);
  return Promise.resolve(a);
};

const get = <T>(key: string): Promise<T | undefined> => {
  const content: T | undefined = memCache.get(key);
  return Promise.resolve(content);
};

export const cacheLocal = {
  add,
  get,
};
