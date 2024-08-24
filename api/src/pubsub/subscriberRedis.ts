import { createClient } from 'redis';

const subscriber = createClient();

subscriber.on('error', (err) => {
  console.error('Redis error:', err);
});

const connectToServer = async () => {
  await subscriber.connect();
};

const subscribeToChannel = async (channel: string, handler: (msg: string) => void) => {
  await subscriber.subscribe(channel, handler);
};

export { connectToServer, subscribeToChannel };
