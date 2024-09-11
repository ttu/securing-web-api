/*
## SITUATION
You got lucky and your site got famous and now it's getting a lot of traffic.

Amount of simultaneous users increased from 5 to 10 000

Traffic spiked from normal few requests per minute to thousandes of requests per minute.

## REQUIREMENTS
We do not have resources to scale up the servers, so we need to optimize the code.


## NOTES
* Database queries are not the fastest and take around 50ms to complete. These can't be optimized.
* Catalog includes complex logic, that will take around 10ms to complete. This will block the thread. Live with it.
*/

import http from 'k6/http';
import { check, sleep } from 'k6';

import { CDN_PORT, LB_PORT, API_PORT } from './server_config.js';

const PORT = LB_PORT;

const BASE_URL = `http://localhost:${PORT}`;
const API_URL = `${BASE_URL}/api/products`;

// const URLS = ['/details', '/prices'];
const URLS = ['/details', '/prices', '/catalog/us', '/catalog/uk', '/catalog/de'];

const getRandomUrl = () => URLS[Math.floor(Math.random() * URLS.length)];

export const options = {
  vus: 1000, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const url = getRandomUrl();
  const res = http.get(`${API_URL}${url}`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.01);
}
