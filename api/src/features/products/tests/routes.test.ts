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

  it('GET /catalog', async () => {
    const resEn = await request(app).get('/api/products/catalog/en');
    expect(resEn.body.length).toEqual(db.PRODUCTS.length);
    expect(resEn.body[0].country).toEqual('en');

    const resFi = await request(app).get('/api/products/catalog/fi');
    expect(resFi.body.length).toEqual(db.PRODUCTS.length);
    expect(resFi.body[0].country).toEqual('fi');
  });

  it('POST /admin/prices - invalid payload', async () => {
    const payload = { productId: 1, price: 100 };
    const token = '1';
    const res = await request(app)
      .post('/api/products/admin/prices')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
  });

  it('POST /admin/prices - valid payload', async () => {
    const payload = [{ productId: 1, price: 100 }];
    const token = '1';
    const res = await request(app)
      .post('/api/products/admin/prices')
      .send(payload)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(400);
  });
});
