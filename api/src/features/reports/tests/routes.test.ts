import request from 'supertest';

import app from '../../../app';

describe('Reports route', () => {
  it('GET /reports - no authentication', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.status).toEqual(401);
  });
  it('GET /reports - authentication with invalid token', async () => {
    const token = 'invalid-token';
    const res = await request(app).get('/api/reports').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(401);
  });
  it('GET /reports - authentication', async () => {
    const token = '2';
    const res = await request(app).get('/api/reports').set('Authorization', `Bearer ${token}`);
    expect(res.status).toEqual(200);
  });
});
