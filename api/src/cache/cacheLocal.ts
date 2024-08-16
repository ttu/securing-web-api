import memoryCache from 'memory-cache';

const memCache = new memoryCache.Cache<string, unknown>();

const add = <T>(key: string, value: T, durationInSec: number): Promise<boolean> => {
  // Create a deep copy of the value using JSON serialization
  const deepCopyValue = JSON.parse(JSON.stringify(value));
  memCache.put(key, deepCopyValue, durationInSec * 1000);
  return Promise.resolve(true);
};

const del = (key: string): Promise<boolean> => {
  const result = memCache.del(key);
  return Promise.resolve(result);
};

const get = <T>(key: string): Promise<T | undefined> => {
  const content = memCache.get(key) as T | undefined;
  return Promise.resolve(content);
};

export const cacheLocal = {
  add,
  del,
  get,
};
