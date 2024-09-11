/*
## SITUATION
Customer support is complaining that database is full of duplicate messages and it is impossible
to find relevant messages.

## REQUIREMENTS
Client side is being developed by offshore team and we do not have possibility to
make changes to it, so we need to fix the issue on the server side.

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
