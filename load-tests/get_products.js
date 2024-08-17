import http from 'k6/http';
import { sleep } from 'k6';

const CDN_PORT = 80;
const LB_PORT = 8080;
const API_PORT = 3000;

const PORT = API_PORT;

const BASE_URL = `http://localhost:${PORT}`;

const API_URL = `${BASE_URL}/api/products`;

export const options = {
  vus: 5, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  http.get(`${API_URL}/details/`);

  // Slow down the requests to avoid overwhelming the server
  sleep(0.5);
}
