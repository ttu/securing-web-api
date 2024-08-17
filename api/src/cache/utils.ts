import * as cache from './cache';

export const cacheWrapper = async <T>(cacheKey: string, getData: () => Promise<T>) => {
  const cached = await cache.get<T>(cacheKey);
  if (cached) {
    console.log('Cache hit:', cacheKey);
    return cached;
  }

  const data = await getData();
  await cache.add(cacheKey, data);
  return data;
};
