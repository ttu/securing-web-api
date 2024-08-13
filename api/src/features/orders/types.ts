import crypto from 'crypto';

export type ProductInfo = {
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  products: ProductInfo[];
};

export type StoredOrder = Order & {
  id: number;
  customerId: number;
};

export const idempotencyKey = (customerId: number, order: Order) => {
  // Sort products by name to ensure consistent order
  const sortedProducts = order.products
    .slice() // Create a shallow copy to avoid modifying the original order
    .sort((a, b) => a.name.localeCompare(b.name));
  // Create a unique string based on customerId and product details
  const dataString = customerId + sortedProducts.map((p) => `${p.name}:${p.price}:${p.quantity}`).join('|');

  // Hash the resulting string to create a consistent, unique key
  return crypto.createHash('sha256').update(dataString).digest('hex');
};
