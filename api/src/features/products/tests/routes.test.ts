import request from 'supertest';

import app from '../../../app';
import * as db from '../db';
import { convertToProductPrice, Product, ProductPrice } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'iPhone X', manufacturer: 'Apple' },
  { id: 2, name: 'Samsung S11', manufacturer: 'Samsung' },
  { id: 3, name: 'OnePlus 4', manufacturer: 'OnePlus' },
  { id: 4, name: 'Google Pixel 5', manufacturer: 'Google' },
  { id: 5, name: 'Xiaomi Redmi Note 6', manufacturer: 'Xiaomi' },
];

const MOCK_PRODUCT_PRICES: ProductPrice[] = [
  { productId: 1, price: 999, country: 'US', startDate: new Date() },
  { productId: 2, price: 899, country: 'US', startDate: new Date() },
  { productId: 3, price: 699, country: 'US', startDate: new Date() },
  { productId: 4, price: 799, country: 'US', startDate: new Date() },
  { productId: 5, price: 499, country: 'US', startDate: new Date() },
  { productId: 1, price: 999, country: 'EN', startDate: new Date() },
  { productId: 2, price: 899, country: 'EN', startDate: new Date() },
  { productId: 3, price: 699, country: 'EN', startDate: new Date() },
  { productId: 4, price: 799, country: 'EN', startDate: new Date() },
  { productId: 5, price: 499, country: 'EN', startDate: new Date() },
  { productId: 1, price: 999, country: 'FI', startDate: new Date() },
  { productId: 2, price: 899, country: 'FI', startDate: new Date() },
  { productId: 3, price: 699, country: 'FI', startDate: new Date() },
  { productId: 4, price: 799, country: 'FI', startDate: new Date() },
  { productId: 5, price: 499, country: 'FI', startDate: new Date() },
];

beforeEach(() => {
  jest.mock('../db'); // Automatically mock the db module
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Products route', () => {
  it('GET /details', async () => {
    jest.spyOn(db, 'getProducts').mockResolvedValueOnce(MOCK_PRODUCTS);

    const res = await request(app).get('/api/products/details');
    expect(res.body).toEqual(MOCK_PRODUCTS);
    expect(res.header['cache-control']).toEqual('public, max-age=600');
  });

  it('GET /prices', async () => {
    jest.spyOn(db, 'getPrices').mockResolvedValueOnce(MOCK_PRODUCT_PRICES);

    const res = await request(app).get('/api/products/prices');
    const productPrices = convertToProductPrice(res.body);
    expect(productPrices).toEqual(MOCK_PRODUCT_PRICES);
  });

  it('GET /catalog', async () => {
    jest.spyOn(db, 'getProducts').mockResolvedValueOnce(MOCK_PRODUCTS);
    jest.spyOn(db, 'getPrices').mockResolvedValueOnce(MOCK_PRODUCT_PRICES);

    const resEn = await request(app).get('/api/products/catalog/en');
    expect(resEn.status).toEqual(200);
    expect(resEn.body.length).toEqual(MOCK_PRODUCTS.length);

    const resFi = await request(app).get('/api/products/catalog/fi');
    expect(resFi.status).toEqual(200);
    expect(resFi.body.length).toEqual(MOCK_PRODUCTS.length);
  });

  it('GET /catalog - invalid country', async () => {
    const res = await request(app).get('/api/products/catalog/xx');
    expect(res.status).toEqual(404);
  });

  it('POST /admin/prices - invalid data', async () => {
    const payload = { productId: 1, price: 100 };
    const token = '1';
    const res = await request(app)
      .post('/api/products/admin/prices')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
  });

  it('POST /admin/prices - incorrect data', async () => {
    const payload: ProductPrice[] = [{ productId: 1, price: 100, country: '', startDate: new Date() }];
    const token = '1';
    const res = await request(app)
      .post('/api/products/admin/prices')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(422);
  });

  it('POST /admin/prices - valid data', async () => {
    const payload: ProductPrice[] = [{ productId: 1, price: 100, country: 'US', startDate: new Date() }];
    const token = '1';
    const res = await request(app)
      .post('/api/products/admin/prices')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
  });
});
