import { Order, StoredOrder, idempotencyKey } from './types';

export const ORDERS: StoredOrder[] = [];

export const hasOrder = async (customerId: number, order: Order) => {
  // TODO: Implement check for existing order
  return ORDERS.some((o) => o.customerId === customerId);
};

export const getOrders = async (customerId: number) => {
  return ORDERS.filter((o) => o.customerId === customerId);
};

export const createCustomerOrder = async (customerId: number, order: Order) => {
  const orderToStore: StoredOrder = {
    ...order,
    customerId: customerId,
    id: ORDERS.length + 1,
  };
  ORDERS.push(orderToStore);

  return Promise.resolve(true);
};
