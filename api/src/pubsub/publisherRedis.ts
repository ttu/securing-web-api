import { createClient } from 'redis';

const publisher = createClient();

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
