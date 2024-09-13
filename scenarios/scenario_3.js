/*
## SITUATION
We are gaining customers from all around the globe. Customers are complaining that the site is slow, and cloud infrastructure bills are increasing.

## REQUIREMENTS
We need to optimize our infrastructure to serve customers faster. Additionally, we aim to reduce server load and costs.

1. P95 for http_req_duration_customers should be under 30ms.
2. http_reqs over 10,000/s
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTS_URL = `${BASE_URL}/api/products`;

const URLS = ['/details', '/prices', '/catalog/us', '/catalog/uk', '/catalog/de'];
const getRandomUrl = () => URLS[Math.floor(Math.random() * URLS.length)];

export const options = {
  vus: 300, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const url = getRandomUrl();
  const res = http.get(`${PRODUCTS_URL}${url}`);

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(0.01);
}
