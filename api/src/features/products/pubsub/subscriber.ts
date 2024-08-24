import { connectToServer, subscribeToChannel } from '../../../pubsub/subscriberRedis';
import { updatePrices } from '../service';

(async () => {
  await connectToServer();
  console.log('Connected to Redis server');

  const handler = async (msg: string) => {
    await updatePrices(JSON.parse(msg));
  };
  subscribeToChannel('price-update', handler);
})();
