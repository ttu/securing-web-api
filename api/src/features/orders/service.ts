import * as db from './db';
import { OrderDto, idempotencyKey, Order, StoredOrder } from './types';
import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';

const ORDERS_CACHE_KEY = 'orders';
const ORDERS_IDEMPOTENCY_KEY = 'orders_idempotency';

export const getOrders = async (customerId: number): Promise<StoredOrder[]> => {
  const orders = await cacheWrapper(`${ORDERS_CACHE_KEY}_${customerId}`, () => db.getOrders(customerId));
  return orders;
};

export const createOrder = async (customerId: number, orderDto: OrderDto): Promise<boolean> => {
  const key = idempotencyKey(customerId, orderDto);

  // Check if order has been processed
  const processed = await cache.get(`${ORDERS_IDEMPOTENCY_KEY}_${key}`);
  if (processed) return true;

  const order = await createOrderFromDto(customerId, orderDto);
  await db.createCustomerOrder(customerId, order);

  // Customer can't make same order again in 20 sec
  await cache.add(`${ORDERS_IDEMPOTENCY_KEY}_${key}`, true, 100);

  const invalidateResult = await cache.del(`${ORDERS_CACHE_KEY}_${customerId}`);
  console.log('Order cache invalidated from customer', { result: invalidateResult, customerId });

  return true;
};

const createOrderFromDto = async (customerId: number, orderDto: OrderDto): Promise<Order> => {
  const products = await Promise.all(
    orderDto.products.map(async (product) => {
      const [name, price] = await db.getProductAndPrice(product.id);
      return { id: product.id, name, price, quantity: product.quantity };
    })
  );

  const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

  return {
    products: products,
    total,
    address: orderDto.address,
    customerId,
  };
};
