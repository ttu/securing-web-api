/*
## SITUATION
We have slow endpoints that block the thread. Functionality has been optimized. For unspecified reason, slow reports-endpoint must be called every 10 seconds.

## REQUIREMENTS
Slow endpoint can't prevent users from using our system. We can't affect how often reports-endpoints are called, but those must be always be callable and can't be cached.

1. P95 for http_req_duration_customers should be under 100ms.
2. http_reqs over 500/s

After massive increase in customer traffic, money is not an issue anymore, so we can scale up the servers.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = LB_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTS_URL = `${BASE_URL}/api/products/details`;
const REPORTS_URL = `${BASE_URL}/api/reports`;

export let options = {
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

const durationA = new Trend('http_req_duration_customers');
const durationB = new Trend('http_req_duration_intetrnal');

export function products() {
  const res = http.get(PRODUCTS_URL);
  check(res, { 'Products: status is 200': (r) => r.status === 200 });
  durationA.add(res.timings.duration);

  sleep(0.1);
}

export function reports() {
  const params = {
    headers: { Authorization: `Bearer 1` },
  };

  const res = http.get(REPORTS_URL, params);
  check(res, { 'Reports: status is 200': (r) => r.status === 200 });
  durationB.add(res.timings.duration);

  sleep(2);
}
