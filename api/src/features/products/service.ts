import * as db from './db';
import { Product, ProductPrice } from './types';
import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';

const PRODUCTS_CACHE_KEY = 'products';
const PRICES_CACHE_KEY = 'prices';

export const getProducts = async (): Promise<Product[]> => getUsersCache();
export const getPrices = async (): Promise<ProductPrice[]> => getPricesCached();

const getProductsNoCache = async () => {
  const products = await db.getProducts();
  return products;
};

const getProductsWithoutCacheWrapper = async (): Promise<Product[]> => {
  const cachedProducts = await cache.get<Product[]>(PRODUCTS_CACHE_KEY);
  if (cachedProducts) {
    console.log('Cache hit');
    return cachedProducts;
  }
  const users = await db.getProducts();
  cache.add(PRODUCTS_CACHE_KEY, users);
  return users;
};

const getUsersCache = async (): Promise<Product[]> => {
  const products = await cacheWrapper(PRODUCTS_CACHE_KEY, () => db.getProducts());
  return products;
};

export const getPricesCached = async () => {
  const products = await cacheWrapper(PRICES_CACHE_KEY, () => db.getPrices());
  return products;
};

export const updatePrices = async (prices: ProductPrice[]) => {
  console.log('Update prices', { dataReceived: prices });
  const success = await db.updatePrices(prices);
  if (success) {
    const invalidateResult = await cache.del(PRICES_CACHE_KEY);
    console.log('Prices cache invalidated', { result: invalidateResult });
  }
};
