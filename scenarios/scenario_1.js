/*
## SITUATION
You got lucky, and your site became famous, leading to a surge in traffic.

The number of simultaneous users increased from 5 to 10,000.

Traffic spiked from a few requests per second to thousands of requests per second.

## REQUIREMENTS
We don’t have the resources to scale up the servers, so we have to think something else.

1. P95 for http_req_duration_customers should be under 300ms.
2. http_reqs ~500/s

## NOTES
* Database queries take around 50ms to complete and can't be optimized.
* The catalog includes complex logic that takes around 10ms to complete, which blocks the thread. We have to live with it.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { API_PORT } from './server_config.js';

const PORT = API_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/products`;

const URLS = ['/details', '/prices', '/catalog/us', '/catalog/uk', '/catalog/de'];
const getRandomUrl = () => URLS[Math.floor(Math.random() * URLS.length)];

export const options = {
  stages: [
    { duration: '1s', target: 1 }, // warm-up
    { duration: '20s', target: 300 },
  ],
};

export default function () {
  const url = getRandomUrl();
  const res = http.get(`${API_URL}${url}`);

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(0.01);
}
