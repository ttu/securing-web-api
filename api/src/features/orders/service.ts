import * as db from './db';
import { OrderDto, Order, StoredOrder, ProductInfo } from './types';

export const getOrders = async (customerId: number): Promise<StoredOrder[]> => db.getOrders(customerId);

export const createOrder = async (customerId: number, orderDto: OrderDto): Promise<boolean> => {
  const order = await createOrderFromDto(customerId, orderDto);
  await db.createCustomerOrder(customerId, order);
  return true;
};

const getProductAndPrice = async (productId: number): Promise<[string, number]> => db.getProductAndPrice(productId);

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
