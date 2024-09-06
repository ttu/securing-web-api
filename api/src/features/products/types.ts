export type Product = {
  id: number;
  name: string;
  manufacturer: string;
};

export type ProductPrice = {
  productId: number;
  price: number;
  country: string;
  startDate: Date;
};

export type ProductForCountryCatalog = {
  id: number;
  name: string;
  manufacturer: string;
  price: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertToProductPrice = (json: any[]): ProductPrice[] => {
  return json.map((item) => ({
    productId: item.productId,
    price: item.price,
    country: item.country,
    startDate: new Date(item.startDate),
  }));
};

// JSON data has date in string, so it needs to be converted to Date object
// Due to that we can't use TypeScript type guard
// export const isValidPriceDataJson = (data: any[]): data is ProductPrice[] => {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidPriceDataJson = (data: any[]) => {
  return (
    Array.isArray(data) &&
    data.every(
      ({ productId, price, country, startDate, ...extra }) =>
        typeof productId === 'number' &&
        typeof price === 'number' &&
        typeof country === 'string' &&
        typeof startDate === 'string' &&
        !isNaN(Date.parse(startDate)) &&
        Object.keys(extra).length === 0 // No extra properties
    )
  );
};

export const hasValidProductPrice = (prices: ProductPrice[]): boolean => {
  return prices.every((price) => price.country.trim() !== '' && price.price > 0);
};
