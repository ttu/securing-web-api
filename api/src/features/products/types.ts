export type Product = {
  id: number;
  name: string;
};

export type ProductPrice = {
  productId: number;
  price: number;
  country: string;
};

export type ProductForCountryCatalog = {
  id: number;
  name: string;
  price: number;
};

export const isValidPriceData = (data: ProductPrice[]) => {
  return (
    data.length > 0 &&
    data.every(
      ({ productId, price, country, ...extra }) =>
        typeof productId === 'number' &&
        productId > 0 &&
        typeof price === 'number' &&
        price > 0 &&
        typeof country === 'string' &&
        country.trim() !== '' &&
        Object.keys(extra).length === 0 // No extra properties
    )
  );
};
