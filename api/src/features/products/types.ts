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
