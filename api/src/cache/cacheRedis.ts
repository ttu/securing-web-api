import { createClient } from 'redis';

// Initialize Redis client with environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const client = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

client.on('error', (err) => console.log('Redis Client Error', err));

export const startServer = async () => {
  await client.connect();
};

const add = async <T>(key: string, value: T, durationInSec: number) =>
  await client.set(key, JSON.stringify(value), { EX: durationInSec });

const get = async <T>(key: string): Promise<T | undefined> => {
  const value = await client.get(key);
  return value ? JSON.parse(value) : undefined;
};

export const cacheRedis = {
  add,
  get,
};
