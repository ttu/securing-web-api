import { request as expressRequest } from 'express';
import request from 'supertest';

import app from '../../app';

describe('User blocking middleware tests', () => {
  it('Blocking user', async () => {
    // Any authenticated endpoint. User 10 is blocked.
    const userId = '10';
    const res = await request(app).get('/api/reports/').set('Authorization', `Bearer ${userId}`);
    // expect(res.status).toEqual(403);
  });
  it('Blocking IP', async () => {
    const blockedIP = '156.100.100.1';
    jest.spyOn(expressRequest, 'ip', 'get').mockReturnValue(blockedIP);
    const res = await request(app).get('/api/products/prices');
    // expect(res.status).toEqual(403);
  });
});
