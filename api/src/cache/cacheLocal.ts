const CACHE_LOCAL: Map<string, any> = new Map();

const addLocal = <T>(key: string, value: T, durationInSec: number) => Promise.resolve(CACHE_LOCAL.set(key, value));

const getLocal = <T>(key: string): Promise<T | undefined> =>
  Promise.resolve(CACHE_LOCAL.has(key) ? CACHE_LOCAL.get(key) : undefined);

export const cacheLocal = {
  add: addLocal,
  get: getLocal,
};
