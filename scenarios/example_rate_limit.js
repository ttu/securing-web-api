/*
## RATE LIMIT EXAMPLE
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/products`;

const URLS = ['/details', '/prices', '/catalog/us', '/catalog/uk', '/catalog/de'];
const getRandomUrl = () => URLS[Math.floor(Math.random() * URLS.length)];

export const options = {
  vus: 1, // A number specifying the number of VUs to run concurrently.
  duration: '60s', // A string specifying the total duration of the test run.
};

export default function () {
  const url = getRandomUrl();
  const res = http.get(`${API_URL}${url}`);

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(0.01);
}
