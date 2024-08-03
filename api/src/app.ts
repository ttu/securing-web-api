import express, { Request, Response, Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import { client, connectToServer } from './cache/cacheRedis';
import { router as usersRouter } from './features/users/routes';
import { router as productsRouter } from './features/products/routes';
import { router as reportsRouter } from './features/reports/routes';
import { router as supportRouter } from './features/support/routes';
import { cacheMiddleware } from './cache/cacheMiddleware';
import RedisStore from 'rate-limit-redis';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const useRedis = process.env.CACHE === 'redis';

if (useRedis) {
  connectToServer().then(() => {
    console.log('Connected to Redis');
  });
}

const rateLimitStore = useRedis
  ? new RedisStore({ sendCommand: (...args: string[]) => client.sendCommand(args) })
  : undefined;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  store: rateLimitStore,
});

// Apply the rate limiting middleware to all requests.
// app.use(limiter);

// NOTE: For authenticatiod routes, we should not cache the response
app.use(cacheMiddleware(5));

app.set('etag', true);

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/support', supportRouter);

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World with TypeScript!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
