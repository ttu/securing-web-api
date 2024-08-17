import * as db from './db';
import { Product, ProductPrice, ProductForCountryCatalog } from './types';
import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';
import { blockingSleep } from '../../utils';

const PRODUCTS_CACHE_KEY = 'products';
const PRICES_CACHE_KEY = 'prices';
const CATALOG_CACHE_KEY = 'prices';

// Non-cached versions
// export const getProducts = async (): Promise<Product[]> => getProductsNoCache();
// export const getPrices = async (): Promise<ProductPrice[]> => db.getPrices();
// export const getCatalog = async (country: string): Promise<Product[]> => getCatalogForCountry(country);

// Cached versions
export const getProducts = async (): Promise<Product[]> => getProductsCache();
export const getPrices = async (): Promise<ProductPrice[]> => getPricesCached();
export const getCatalog = async (country: string): Promise<Product[]> => getCatalogCached(country);

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
  await cache.add(PRODUCTS_CACHE_KEY, users);
  return users;
};

const getProductsCache = async (): Promise<Product[]> => {
  const products = await cacheWrapper(PRODUCTS_CACHE_KEY, () => db.getProducts());
  return products;
};

const getPricesCached = async (): Promise<ProductPrice[]> => {
  const products = await cacheWrapper(PRICES_CACHE_KEY, () => db.getPrices());
  return products;
};

const getCatalogForCountry = async (country: string): Promise<ProductForCountryCatalog[]> => {
  console.log('Executing slow logig for catalog for country', { country });

  // For demonstration purposes, skip the logic and return empty array
  // blockingSleep(1000);
  // return [];

  const [products, prices] = await Promise.all([getProducts(), getPrices()]);

  // NOTE: This functionality includes some bad logic, so it is extremely slow
  // Low slow downs can be hard to notice, try with different values
  blockingSleep(100);

  // Create a map for prices with productId as the key
  const priceMap = new Map(prices.map((p) => [p.productId, p.price]));

  const catalog = products.map((product) => {
    return { ...product, price: priceMap.get(product.id) || 0, country };
  });
  return catalog;
};

const getCatalogCached = async (country: string): Promise<ProductForCountryCatalog[]> => {
  const catalogForCountry = await cacheWrapper(`${CATALOG_CACHE_KEY}_${country}`, async () =>
    getCatalogForCountry(country)
  );
  return catalogForCountry;
};

export const updatePrices = async (prices: ProductPrice[]) => {
  console.log('Update prices', { dataReceived: prices });
  const success = await db.updatePrices(prices);
  if (success) {
    const invalidateResult = await cache.del(PRICES_CACHE_KEY);
    console.log('Prices cache invalidated', { result: invalidateResult });
  }
};
