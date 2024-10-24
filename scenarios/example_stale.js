/*
## Stale while revalidate

Use this script to show how the CDN can serve stale content while revalidating the cache.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/products/details`;

export const options = {
  vus: 10, // A number specifying the number of VUs to run concurrently.
  duration: '60s', // A string specifying the total duration of the test run.
};

export default function () {
  const res = http.get(API_URL);

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(1);
}
