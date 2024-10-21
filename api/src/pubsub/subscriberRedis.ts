import { createClient } from 'redis';

// Initialize Redis client with environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

const subscriber = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectToServer = async () => {
  await subscriber.connect();
};

const subscribeToQueue = async (queue: string, handler: (msg: string) => Promise<void>) => {
  while (true) {
    // Use blPop instead of subscribe as we want that each message
    // is processed by only a single subscriber
    console.log('Waiting for messages...');
    const result = await subscriber.blPop(queue, 0);
    if (result?.element) await handler(result?.element); // Process the message
  }
};

export { connectToServer, subscribeToQueue };
