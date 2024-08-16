import request from 'supertest';

import app from '../../../app';

describe('Support route', () => {
  it('POST /messages - invalid message', async () => {
    const payload = { message: 'Hello' };
    const res = await request(app).post('/api/support/messages').send(payload);
    expect(res.status).toEqual(400);
  });
  it('POST /messages - valid message', async () => {
    const payload = { message: { message: 'Hello', sender: 'me@email.org' } };
    const res = await request(app).post('/api/support/messages').send(payload);
    expect(res.status).toEqual(200);
  });
});
