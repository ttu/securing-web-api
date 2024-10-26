import * as db from './db';
import { Product, ProductPrice, ProductForCountryCatalog } from './types';
import * as cache from '../../cache/cache';
import { cacheWrapper } from '../../cache/utils';
import { blockingSleep } from '../../utils';

const PRODUCTS_CACHE_KEY = 'products';
const PRICES_CACHE_KEY = 'prices';
const CATALOG_CACHE_KEY = 'prices';

// Non-cached versions
export const getProducts = async (): Promise<Product[]> => getProductsNoCache();
export const getPrices = async (): Promise<ProductPrice[]> => db.getPrices();
export const getCatalog = async (country: string): Promise<Product[]> => getCatalogForCountry(country);

// Cached versions
// export const getProducts = async (): Promise<Product[]> => getProductsCached();
// export const getPrices = async (): Promise<ProductPrice[]> => getPricesCached();
// export const getCatalog = async (country: string): Promise<Product[]> => getCatalogCached(country);

const getProductsNoCache = async () => {
  const products = await db.getProducts();
  return products;
};

// const getProductsWithCache = async (): Promise<Product[]> => {
//   const cachedProducts = await cache.get<Product[]>(PRODUCTS_CACHE_KEY);
//   if (cachedProducts) {
//     console.log('Cache hit');
//     return cachedProducts;
//   }
//   const products = await db.getProducts();
//   await cache.add(PRODUCTS_CACHE_KEY, products);
//   return products;
// };

// const getProductsCached = async (): Promise<Product[]> => {
//   const products = await cacheWrapper(PRODUCTS_CACHE_KEY, () => db.getProducts());
//   return products;
// };

// const getPricesCached = async (): Promise<ProductPrice[]> => {
//   const products = await cacheWrapper(PRICES_CACHE_KEY, () => db.getPrices());
//   return products;
// };

const getCatalogForCountry = async (country: string): Promise<ProductForCountryCatalog[]> => {
  console.log('Executing slow logic for catalog for country', { country });

  // For demonstration purposes, skip the logic and return empty array
  // blockingSleep(1000);
  // return [];

  const [products, prices] = await Promise.all([getProducts(), getPrices()]);

  // NOTE: This functionality includes some bad logic, so it is extremely slow
  // If data base has over 10k products and multiple prices per products, this starts to be slow
  // Low slow downs can be hard to notice, try with different values
  // blockingSleep(10);

  const pricesForCountry = prices.filter((p) => p.country.toLocaleLowerCase() === country.toLocaleLowerCase());

  // Remove this to show how this endpoint doesn't work correctly with invalid country
  if (pricesForCountry.length === 0) return [];

  // Create a map for prices with productId as the key
  const priceMap = new Map(pricesForCountry.map((p) => [p.productId, p.price]));

  const catalog = products.map((product) => {
    return { ...product, price: priceMap.get(product.id) || 0 };
  });
  return catalog;
};

// const getCatalogCached = async (country: string): Promise<ProductForCountryCatalog[]> => {
//   const catalogForCountry = await cacheWrapper(`${CATALOG_CACHE_KEY}_${country}`, async () =>
//     getCatalogForCountry(country)
//   );
//   return catalogForCountry;
// };

export const updatePrices = async (prices: ProductPrice[]) => {
  console.log('Update prices', { dataReceived: prices });
  const success = await db.insertPrices(prices);
  if (success) {
    const invalidateResult = await cache.del(PRICES_CACHE_KEY);
    console.log('Prices cache invalidated', { result: invalidateResult });
  }
};
