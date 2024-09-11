/*
## SITUATION
It is a holiday season from school. Kids are bored. Hacker is hammering our server.

## REQUIREMENTS
Block the hacker.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = API_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/products/details`;

export const options = {
  vus: 500, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const res = http.get(API_URL);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.001);
}
