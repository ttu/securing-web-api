import http from 'k6/http';
import { sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = API_PORT;

const BASE_URL = `http://localhost:${PORT}`;

const HELLO_URL = `${BASE_URL}/hello/`;

export const options = {
  vus: 50, // A number specifying the number of VUs to run concurrently.
  duration: '10s', // A string specifying the total duration of the test run.
  // stages: [
  //   { duration: '10s', target: 50 }, // Ramp up to 50 VUs
  //   { duration: '10s', target: 100 }, // Stay at 100 VUs
  //   { duration: '10s', target: 0 }, // Ramp down to 0 VUs
  // ],
};

export default function () {
  http.get(HELLO_URL);
}
