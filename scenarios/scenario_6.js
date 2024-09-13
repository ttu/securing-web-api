/*
## SITUATION
Customer support is complaining that the database is full of duplicate messages, making it impossible to find relevant ones.

## REQUIREMENTS
The client-side is being developed by an offshore team, and we do not have the ability to make changes to it. Therefore, we need to fix the issue on the server side.

1. The database should only contain unique messages.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';
import { vu } from 'k6/execution';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/support/messages`;

export const options = {
  vus: 1, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const customerId = vu.idInTest;
  const msg = { message: { message: 'Hello', sender: `${customerId}@email.org` } };
  const payload = JSON.stringify(msg);
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(MESSAGES_URL, payload, params);

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(5);
}
