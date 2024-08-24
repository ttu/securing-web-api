import { eventEmitter } from './subscriberLocal';

export const publishMessage = async <T>(event: string, data: T): Promise<boolean> => {
  console.log(`Publishing data: ${data}`);
  eventEmitter.emit(event, data);
  return Promise.resolve(true);
};
