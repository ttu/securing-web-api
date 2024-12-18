/*
## SITUATION
It’s the holiday season, and kids are bored. A hacker is hammering our server.

## REQUIREMENTS
Block the hacker.

1. More than 99% of requests should be blocked.

## NOTE:
* The hacker is using a single script to make requests, and all requests are coming from the same IP.
* He is an authenticated user.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const ORDERS_URL = `${BASE_URL}/api/orders/`;

export const options = {
  stages: [
    { duration: '1s', target: 1 }, // warm-up
    { duration: '20s', target: 300 },
  ],
};

export default function () {
  const customeToken = 2;
  const params = {
    headers: {
      Authorization: `Bearer ${customeToken}`,
      'Content-Type': 'application/json',
    },
  };

  const res = http.get(ORDERS_URL, params);

  check(res, { 'status is 200': (r) => r.status === 200 });

  // Also possible to test with creating a new order endpoint
  // const randomProductId = Math.floor(Math.random() * 10) + 1;
  // const randomQuantity = Math.floor(Math.random() * 5) + 1;

  // const order = { address: 'street 10', products: [{ id: randomProductId, quantity: randomQuantity }] };
  // const payload = JSON.stringify(order);

  // const res = http.post(ORDERS_URL, payload, params);

  // check(res, { 'status is 201': (r) => r.status === 201 });
}
