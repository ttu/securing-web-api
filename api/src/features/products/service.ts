import * as db from './db';
import { ProductPrice } from './types';

export const getProducts = async () => {
  return await db.getProducts();
};

export const getPrices = async () => {
  return await db.getPrices();
};

export const updatePrices = async (prices: ProductPrice[]) => {
  console.log('Update prices', { dataReceived: prices });
  return await db.updatePrices(prices);
};
