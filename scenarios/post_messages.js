import http from 'k6/http';
import { sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;

const MESSAGES_URL = `${BASE_URL}/api/support/messages`;

export const options = {
  vus: 1, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const msg = { message: { message: 'Hello', sender: 'me@email.org' } };
  const payload = JSON.stringify(msg);
  const params = { headers: { 'Content-Type': 'application/json' } };

  http.post(MESSAGES_URL, payload, params);
  sleep(0.1);
}
