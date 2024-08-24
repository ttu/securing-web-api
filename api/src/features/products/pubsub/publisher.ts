import { connectToServer, publishMessage } from '../../../pubsub/publisherRedis';

const payload = [{ productId: 1, price: 100 }];

(async () => {
  await connectToServer();
  console.log('Connected to Redis server');

  const res = await publishMessage('price-update', payload);
  console.log('Message published:', res);
})();
