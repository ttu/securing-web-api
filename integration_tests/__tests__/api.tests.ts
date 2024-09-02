const request = require('supertest');

const CDN_URL = 'http://localhost:80';

describe('Integration Test via Load Balancer', () => {
  it('GET /products/details - should return a list of products', async () => {
    const res = await request(CDN_URL)
      .get('/api/products/details')
      .expect('Content-Type', /json/) // content-type is application/json xxxx
      .expect(200);

    const products = res.body;
    expect(products).toBeInstanceOf(Array);
    expect(products.length).toBeGreaterThan(0);

    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('name');
    expect(products[0]).toHaveProperty('manufacturer');
  });

  it('GET /products/prices - should return a list of prices', async () => {
    const res = await request(CDN_URL).get('/api/products/prices').expect('Content-Type', /json/).expect(200);

    const prices = res.body;
    expect(prices).toBeInstanceOf(Array);
    expect(prices.length).toBeGreaterThan(0);

    expect(prices[0]).toHaveProperty('productId');
    expect(prices[0]).toHaveProperty('price');
    expect(prices[0]).toHaveProperty('country');
    expect(prices[0]).toHaveProperty('startDate');
  });

  it('GET /orders - should return customers orders', async () => {
    const customerid_token = 2;
    const res = await request(CDN_URL)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerid_token}`)
      .expect('Content-Type', /json/)
      .expect(200);

    const orders = res.body;
    expect(orders).toBeInstanceOf(Array);
    expect(orders.length).toBeGreaterThan(0);

    const order = orders[0];
    expect(order).toHaveProperty('customerId');
    expect(order).toHaveProperty('address');
    expect(order).toHaveProperty('total');
    expect(order).toHaveProperty('products');
  });

  it('POST /orders - should create a new customer order', async () => {
    const customerid_token = 2;
    const payload = { address: 'street 10', products: [{ id: 2, quantity: 1 }] };

    const res = await request(CDN_URL)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerid_token}`)
      .send(payload)
      .expect(200);

    expect(res.body).toBeTruthy();
  });
});
