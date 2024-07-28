import { Product, ProductPrice } from './types';
import { sleep } from '../../utils';

const PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone X' },
  { id: 2, name: 'Samsung S11' },
  { id: 3, name: 'OnePlus 4' },
  { id: 4, name: 'Google Pixel 5' },
  { id: 5, name: 'Xiaomi Redmi Note 6' },
];

let PRODUCT_PRICES: ProductPrice[] = [
  { productId: 1, price: 999, country: 'US' },
  { productId: 2, price: 899, country: 'US' },
  { productId: 3, price: 699, country: 'US' },
  { productId: 4, price: 799, country: 'US' },
  { productId: 5, price: 499, country: 'US' },
];

export const getProducts = async () => {
  console.log('DB - Querying products with slow query');
  await sleep();

  return Promise.resolve(PRODUCTS);
};

export const getPrices = async () => {
  console.log('DB - Querying prices with slow query');
  await sleep();

  return Promise.resolve(PRODUCT_PRICES);
};

export const updatePrices = async (prices: ProductPrice[]): Promise<boolean> => {
  console.log('DB - Update prices with slow operation');
  await sleep(2000);

  PRODUCT_PRICES = prices;
  return Promise.resolve(true);
};
