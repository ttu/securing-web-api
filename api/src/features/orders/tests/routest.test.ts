import request from 'supertest';
import app from '../../../app';
import * as db from '../db';
import { Order } from '../types';
import exp from 'constants';

describe('Orders route', () => {
  beforeEach(() => {
    db.ORDERS.push({
      id: 1,
      customerId: 1,
      products: [{ name: 'phone', price: 100, quantity: 1 }],
    });
    db.ORDERS.push({
      id: 2,
      customerId: 2,
      products: [{ name: 'tablet', price: 200, quantity: 1 }],
    });
  });

  afterEach(() => {
    db.ORDERS.length = 0;
  });

  it('GET /', async () => {
    const token = '1';
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual([db.ORDERS[0]]);
  });

  it('POST / - idempotency', async () => {
    const token = 50;
    const payload: Order = { products: [{ name: 'phone', price: 100, quantity: 1 }] };

    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toEqual(200);
    expect(db.ORDERS.filter((o) => o.customerId === 50).length).toEqual(1);

    // Should still have only 1 order
    const res2 = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(db.ORDERS.filter((o) => o.customerId === 50).length).toEqual(1);
  });

  it('GET & POST / - cache invalidation', async () => {
    const token = '2';
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].products[0].price).toEqual(200);

    // Change product price in DB
    db.ORDERS[1].products[0].price = 999;

    // Products should still come from cache
    const resGet2 = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(resGet2.status).toEqual(200);
    expect(resGet2.body.length).toEqual(1);
    expect(resGet2.body[0].products[0].price).toEqual(200);

    const payload: Order = { products: [{ name: 'phone', price: 100, quantity: 1 }] };
    const resPost = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(resPost.status).toEqual(200);

    // Price should come from DB after cache invalidation from the POST request
    const resGet3 = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(resGet3.status).toEqual(200);
    expect(resGet3.body.length).toEqual(2);
    expect(resGet3.body[0].products[0].price).toEqual(999);
  });
});
