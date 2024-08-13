import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';
import * as db from './db';
import { Order, idempotencyKey, StoredOrder } from './types';

const ORDERS_CACHE_KEY = 'orders';
const ORDERS_IDEMPOTENCY_KEY = 'orders_idempotency';

export const getOrders = async (customerId: number): Promise<StoredOrder[]> => {
  const orders = await cacheWrapper(`${ORDERS_CACHE_KEY}_${customerId}`, () => db.getOrders(customerId));
  return orders;
};

export const createOrder = async (customerId: number, order: Order): Promise<boolean> => {
  const key = idempotencyKey(customerId, order);

  // Check if order has been processed
  const processed = await cache.get(`${ORDERS_IDEMPOTENCY_KEY}_${key}`);
  if (processed) return true;

  await db.createCustomerOrder(customerId, order);

  // Customer can't make same order again in 20 sec
  await cache.add(`${ORDERS_IDEMPOTENCY_KEY}_${key}`, true, 100);

  const invalidateResult = await cache.del(`${ORDERS_CACHE_KEY}_${customerId}`);
  console.log('Order cache invalidated from customer', { result: invalidateResult, customerId });

  return true;
};
