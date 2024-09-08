import { cacheLocal } from './cacheLocal';
import { cacheRedis, connectToServer } from './cacheRedis';

const CACHE_DURATION_IN_SEC = 30;

const useRedis = process.env.CACHE === 'redis';

const cache = useRedis ? cacheRedis : cacheLocal;

export const add = <T>(key: string, value: T, durationInSec: number = CACHE_DURATION_IN_SEC): Promise<boolean> =>
  cache.add(key, value, durationInSec);

export const del = (key: string): Promise<boolean> => cache.del(key);

export const get = <T>(key: string): Promise<T | undefined> => cache.get(key);

const init = async (): Promise<void> => {
  if (useRedis) {
    connectToServer().then(() => {
      console.log('Cache connected: REDIS');
    });
  } else {
    console.log('Cache connected: LOCAL');
  }
};

// Init cache immediatly on import
init();
