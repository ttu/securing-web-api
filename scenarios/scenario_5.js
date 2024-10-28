/*
## SITUATION
The warehouse is complaining that we are shipping double orders to customers.

## REQUIREMENTS
The client-side is being developed by an offshore team, and we do not have the ability to make changes to it. Therefore, we need to fix the issue on the server side.

1. The database should only have unique orders.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTS_URL = `${BASE_URL}/api/products/details`;

export const options = {
  vus: 1, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const customeToken = 2;
  const params = {
    headers: {
      Authorization: `Bearer ${customeToken}`,
      'Content-Type': 'application/json',
    },
  };

  const order = { address: 'street 10', products: [{ id: 2, quantity: 1 }] };
  const payload = JSON.stringify(order);

  const res = http.post(PRODUCTS_URL, payload, params);

  check(res, { 'status is 201': (r) => r.status === 201 });

  sleep(5);
}
