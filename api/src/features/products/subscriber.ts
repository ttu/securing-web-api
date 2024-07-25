// In real system we would subscribe to a message broker like RabbitMQ, AWS SMS etc.
import { EventEmitter } from 'events';
import { updatePrices } from './service';
import { ProductPrice } from './types';

const eventEmitter = new EventEmitter();

const Events = {
  PRICE_UPDATE: 'PRICE_UPDATE',
};

const newMessage = async (priceUpdateData: ProductPrice[]) => {
  const result = await updatePrices(priceUpdateData);
  console.log('Prices updated. Status:', result);
};

eventEmitter.on(Events.PRICE_UPDATE, newMessage);

export { eventEmitter, Events };
