import * as db from './db';
import { OrderDto, idempotencyKey, Order, StoredOrder, ProductInfo } from './types';
import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';

const ORDERS_CACHE_KEY = 'orders';
const PRODUCTS_PRICES_CACHE_KEY = 'product_prices';
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
  await cache.add(`${ORDERS_IDEMPOTENCY_KEY}_${key}`, true, 20);

  const invalidateResult = await cache.del(`${ORDERS_CACHE_KEY}_${customerId}`);
  console.log('Order cache invalidated from customer', { result: invalidateResult, customerId });

  return true;
};

const getProductAndPrice = async (productId: number): Promise<[string, number]> =>
  cacheWrapper(`${PRODUCTS_PRICES_CACHE_KEY}_${productId}`, () => db.getProductAndPrice(productId));

const createOrderFromDto = async (customerId: number, orderDto: OrderDto): Promise<Order> => {
  const productInfoPromises: Promise<ProductInfo>[] = orderDto.products.map(async (product) => {
    const [name, price] = await getProductAndPrice(product.id);
    return { id: product.id, name, price, quantity: product.quantity };
  });
  const products = await Promise.all(productInfoPromises);

  const totalPrice = products.reduce((acc, product) => acc + product.price * product.quantity, 0);

  return {
    products: products,
    total: totalPrice,
    address: orderDto.address,
    customerId,
  };
};
