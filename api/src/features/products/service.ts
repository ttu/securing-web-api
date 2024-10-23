import * as db from './db';
import { Product, ProductPrice, ProductForCountryCatalog } from './types';

export const getProducts = async (): Promise<Product[]> => db.getProducts();
export const getPrices = async (): Promise<ProductPrice[]> => db.getPrices();
export const getCatalog = async (country: string): Promise<Product[]> => getCatalogForCountry(country);

const getCatalogForCountry = async (country: string): Promise<ProductForCountryCatalog[]> => {
  console.log('Executing slow logig for catalog for country', { country });

  const [products, prices] = await Promise.all([getProducts(), getPrices()]);

  const pricesForCountry = prices.filter((p) => p.country.toLocaleLowerCase() === country.toLocaleLowerCase());

  if (pricesForCountry.length === 0) return [];

  // Create a map for prices with productId as the key
  const priceMap = new Map(pricesForCountry.map((p) => [p.productId, p.price]));

  const catalog = products.map((product) => {
    return { ...product, price: priceMap.get(product.id) || 0 };
  });
  return catalog;
};

export const updatePrices = async (prices: ProductPrice[]) => {
  console.log('Update prices', { dataReceived: prices });
  await db.insertPrices(prices);
};
