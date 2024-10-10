const request = require('supertest');

const CDN_URL = 'http://localhost:80';

describe('Integration Test via Load Balancer', () => {
  it('GET static - CDN local', async () => {
    const res = await request(CDN_URL).get('/static/index.html');

    const html = res.text;
    expect(html).toContain('<title>Static Website</title>');
  });

  it('GET static - CDN S3', async () => {
    const res = await request(CDN_URL).get('/s3/index.html');

    const html = res.text;
    expect(html).toContain('<title>Static Website from S3</title>');
  });
});
