// In real system we would subscribe to a message broker like RabbitMQ, AWS SMS etc.
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

const subscribeToChannel = async (event: string, handler: () => void) => {
  eventEmitter.on(event, handler);
};

// const Events = {
//   PRICE_UPDATE: 'PRICE_UPDATE',
// };

// const newMessage = async (priceUpdateData: ProductPrice[]) => {
//   const result = await updatePrices(priceUpdateData);
//   console.log('Prices updated. Status:', result);
// };

// eventEmitter.on('PRICE_UPDATE', newMessage);

export { eventEmitter, subscribeToChannel };
