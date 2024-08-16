import express, { Request, Response, Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

import { cacheMiddleware } from './cache/cacheMiddleware';
import { client, connectToServer } from './cache/cacheRedis';
import { router as ordersRouter } from './features/orders/routes';
import { router as productsRouter } from './features/products/routes';
import { router as reportsRouter } from './features/reports/routes';
import { router as supportRouter } from './features/support/routes';
import { router as usersRouter } from './features/users/routes';
import { userBlockingkMiddleware } from './middlewares/userBlockingMiddleware';

const PORT = process.env.PORT || 3000;

const useRedis = process.env.CACHE === 'redis';

const app = express();

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const { method, url } = req;
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

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

app.use(userBlockingkMiddleware);

// Health check
app.get('/health', (req: Request, res: Response) => {
  return res.send('OK');
});

// NOTE: cacheMiddleware should be applied per route
app.use(cacheMiddleware(5));

app.set('etag', true);

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/reports', reportsRouter);
apiRouter.use('/support', supportRouter);
apiRouter.use('/orders', ordersRouter);

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
