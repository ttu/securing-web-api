import crypto from 'crypto';

export type ProductOrderDto = {
  id: number;
  quantity: number;
};

export type OrderDto = {
  products: ProductOrderDto[];
  address: string;
};

export type Customer = {
  id: number;
  name: string;
  email: string;
};

export type ProductInfo = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  products: ProductInfo[];
  total: number;
  address: string;
  customerId: number;
};

export type StoredOrder = Order & {
  id: number;
  orderDate: Date;
};

export const idempotencyKey = (customerId: number, order: OrderDto) => {
  // Sort products by name to ensure consistent order
  const sortedProducts = order.products
    .slice() // Create a shallow copy to avoid modifying the original order
    .sort((a, b) => (a.id > b.id ? 1 : -1));
  // Create a unique string based on customerId and product details
  const dataString = customerId + sortedProducts.map((p) => `${p.id}:${p.quantity}`).join('|');

  // Hash the resulting string to create a consistent, unique key
  return crypto.createHash('sha256').update(dataString).digest('hex');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isProductOrderDto = (data: any): data is ProductOrderDto => {
  const { id, quantity, ...extra } = data;
  return typeof id === 'number' && typeof quantity === 'number' && Object.keys(extra).length === 0;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidOrderDto = (data: any): data is OrderDto => {
  const { products, address, ...extra } = data;
  return (
    Array.isArray(products) &&
    products.every((p) => isProductOrderDto(p)) &&
    typeof address === 'string' &&
    Object.keys(extra).length === 0
  );
};

export const hasValidOrderData = (order: OrderDto): boolean => {
  return (
    order.address.trim() !== '' && order.products.length > 0 && order.products.every((product) => product.quantity > 0)
  );
};
