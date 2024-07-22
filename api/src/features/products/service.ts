import * as db from './db';

export const getProducts = async () => {
  return await db.getProducts();
};

export const getPrices = async () => {
  return await db.getPrices();
};
