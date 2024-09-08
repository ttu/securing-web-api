import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import * as redis from '../cache/cacheRedis';

const useRedis = process.env.CACHE === 'redis';

const rateLimitStore = useRedis
  ? new RedisStore({ sendCommand: (...args: string[]) => redis.client.sendCommand(args) })
  : undefined;

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: rateLimitStore,
});

export { rateLimitMiddleware };
