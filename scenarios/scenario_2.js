/*
## SITUATION
We have slow endpoints that block the thread. The functionality has been optimized, but for unspecified reasons, the slow reports endpoint must be called every 10 seconds.

## REQUIREMENTS
The slow endpoint must not prevent users from using our system. We cannot control how often the reports endpoint is called, but it must always be callable and cannot be cached.

After a massive increase in customer traffic, money is no longer an issue, so we can scale up the servers.

1. P95 for http_req_duration_customers should be under 100ms.
2. http_reqs over 500/s
*/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

import { LB_PORT, API_PORT } from './server_config.js';

const PORT = API_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTS_URL = `${BASE_URL}/api/products`;
const REPORTS_URL = `${BASE_URL}/api/reports`;

const URLS = ['/details', '/prices', '/catalog/us', '/catalog/uk', '/catalog/de'];
const getRandomUrl = () => URLS[Math.floor(Math.random() * URLS.length)];

export const options = {
  scenarios: {
    scenario_customers: {
      executor: 'constant-vus',
      exec: 'products', // Function to be executed for scenario A
      vus: 200,
      duration: '30s',
    },
    scenario_internal: {
      executor: 'constant-vus',
      exec: 'reports', // Function to be executed for scenario B
      vus: 1, // 1 virtual user
      duration: '30s',
    },
  },
};

const durationCustomers = new Trend('http_req_duration_customers');
const durationInternal = new Trend('http_req_duration_intetrnal');

export function products() {
  const url = getRandomUrl();
  const res = http.get(`${PRODUCTS_URL}${url}`);
  check(res, { 'Products: status is 200': (r) => r.status === 200 });
  durationCustomers.add(res.timings.duration);

  sleep(0.1);
}

export function reports() {
  const internalToken = 1234;
  const params = {
    headers: { Authorization: `Bearer ${internalToken}` },
  };

  const res = http.get(REPORTS_URL, params);
  check(res, { 'Reports: status is 200': (r) => r.status === 200 });
  durationInternal.add(res.timings.duration);

  sleep(2);
}
