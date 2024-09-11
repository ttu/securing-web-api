import http from 'k6/http';
import { sleep } from 'k6';

const CDN_PORT = 80;
const LB_PORT = 8080;
const API_PORT = 3000;

const PORT = CDN_PORT;

const BASE_URL = `http://localhost:${PORT}`;

const USERS_URL = `${BASE_URL}/api/reports/`;

const AUTH_TOKEN = '1';

export const options = {
  vus: 5, // A number specifying the number of VUs to run concurrently.
  duration: '20s', // A string specifying the total duration of the test run.
};

export default function () {
  const params = {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
    },
  };

  http.get(USERS_URL, params);
}
