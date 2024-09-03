import request from 'supertest';

import app from '../../../app';
import * as db from '../db';
import { OrderDto, StoredOrder } from '../types';

jest.mock('../db'); // Automatically mock the db module

const MOCK_ORDERS: StoredOrder[] = [
  {
    id: 1,
    customerId: 2,
    address: 'address',
    total: 100,
    orderDate: new Date(),
    products: [{ id: 1, name: 'phone', price: 200, quantity: 1 }],
  },
];

describe('Orders route', () => {
  it('GET /', async () => {
    jest.spyOn(db, 'getOrders').mockResolvedValueOnce(MOCK_ORDERS);

    const token = '2';
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    // NOTE: Compare only id, beacuse the date is different
    expect(res.body[0].id).toEqual(MOCK_ORDERS[0].id);
  });

  it('POST / - invalid data', async () => {
    const payload = { address: 'street 10', products: [] };
    const token = 50;

    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toEqual(400);
  });

  it('POST / - idempotency', async () => {
    jest.spyOn(db, 'getOrders').mockResolvedValueOnce(MOCK_ORDERS);
    jest.spyOn(db, 'getProductAndPrice').mockResolvedValueOnce(['phone', 200]);
    const createOrderSpy = jest.spyOn(db, 'createCustomerOrder');

    const token = 50;
    const payload: OrderDto = { address: 'Main street 1', products: [{ id: 2, quantity: 1 }] };

    const res = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res.status).toEqual(200);

    expect(createOrderSpy).toHaveBeenCalledTimes(1);

    const res2 = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(res2.status).toEqual(200);
    // Should still have only 1 order
    expect(createOrderSpy).toHaveBeenCalledTimes(1);
  });

  it('GET & POST / - cache invalidation', async () => {
    jest.spyOn(db, 'getOrders').mockResolvedValue(MOCK_ORDERS);
    jest.spyOn(db, 'getProductAndPrice').mockResolvedValueOnce(['phone', 200]);
    jest.spyOn(db, 'createCustomerOrder');

    const token = '2';
    const res = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
    expect(res.body[0].products[0].price).toEqual(200);

    // Change product price from mocked order
    MOCK_ORDERS[0].products[0].price = 999;

    // Products should still come from cache
    const resGet2 = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(resGet2.status).toEqual(200);
    expect(resGet2.body[0].products[0].price).toEqual(200);

    // This should invalidate the cache
    const payload: OrderDto = { address: 'Other street 2', products: [{ id: 2, quantity: 1 }] };
    const resPost = await request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(payload);
    expect(resPost.status).toEqual(200);

    // Price should come from DB after cache invalidation from the POST request
    const resGet3 = await request(app).get('/api/orders').set('Authorization', `Bearer ${token}`);
    expect(resGet3.status).toEqual(200);
    expect(resGet3.body[0].products[0].price).toEqual(999);
  });
});
