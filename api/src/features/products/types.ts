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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidPriceDataJson = (data: any[]) => {
  return (
    data.length > 0 &&
    data.every(
      ({ productId, price, country, startDate, ...extra }) =>
        typeof productId === 'number' &&
        productId > 0 &&
        typeof price === 'number' &&
        price > 0 &&
        typeof country === 'string' &&
        country.trim() !== '' &&
        typeof startDate === 'string' &&
        !isNaN(Date.parse(startDate)) &&
        Object.keys(extra).length === 0 // No extra properties
    )
  );
};
