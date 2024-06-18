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

const addRedis = async <T>(key: string, value: T) => await client.set(key, JSON.stringify(value));

const getRedis = async <T>(key: string): Promise<T | undefined> => {
  const value = await client.get(key);
  return value ? JSON.parse(value) : undefined;
};

export const cacheRedis = {
  add: addRedis,
  get: getRedis,
};
