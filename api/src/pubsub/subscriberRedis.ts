import { createClient } from 'redis';

const subscriber = createClient();

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
