import request from 'supertest';

import app from '../../../app';
import pool from '../../../db';

// Mock the pool.query method
jest.mock('../../../db', () => ({
  query: jest.fn(),
}));

describe('Support route', () => {
  it('POST /messages - invalid message', async () => {
    const payload = { message: 'Hello' };
    const res = await request(app).post('/api/support/messages').send(payload);
    expect(res.status).toEqual(400);
  });
  it('POST /messages - valid message', async () => {
    // Mock the pool.query to simulate a successful insertion
    (pool.query as jest.Mock).mockResolvedValueOnce({});

    const payload = { message: { message: 'Hello', sender: 'me@email.org' } };

    const res = await request(app).post('/api/support/messages').send(payload);
    expect(res.status).toEqual(201);

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      payload.message.message,
      payload.message.sender,
      expect.any(Number), // timestamp
      expect.any(String), // ip-address
    ]);
  });
});
