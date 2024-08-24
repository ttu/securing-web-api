import { createClient } from 'redis';

const publisher = createClient();

publisher.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectToServer = async () => {
  await publisher.connect();
};

const publishMessage = async <T>(channel: string, message: T): Promise<boolean> => {
  await publisher.publish(channel, JSON.stringify(message));
  return Promise.resolve(true);
};

// Example usage
// publishMessage('my-channel', 'Hello, Subscriber!');

export { connectToServer, publishMessage };
