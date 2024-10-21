import { createClient } from 'redis';

// Initialize Redis client with environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const publisher = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

publisher.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectToServer = async () => {
  await publisher.connect();
};

const disconnectFromServer = async () => {
  await publisher.disconnect();
};

const publishMessage = async <T>(queue: string, message: T): Promise<boolean> => {
  // Use lPush to publish to queue instead publish to channel
  // as we want to process message in a single subscriber
  await publisher.lPush(queue, JSON.stringify(message));
  return Promise.resolve(true);
};

export { connectToServer, disconnectFromServer, publishMessage };
