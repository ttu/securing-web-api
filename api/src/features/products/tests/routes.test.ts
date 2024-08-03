import request from 'supertest';
import app from '../../../app';
import * as db from '../db';

describe('Products route', () => {
  it('GET /details', async () => {
    const res = await request(app).get('/api/products/details');
    expect(res.body).toEqual(db.PRODUCTS);
  });
  it('GET /prices', async () => {
    const res = await request(app).get('/api/products/prices');
    expect(res.body).toEqual(db.PRODUCT_PRICES);
  });
});
