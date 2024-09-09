import express, { Request, Response, Router } from 'express';

import { cacheMiddleware } from './cache/cacheMiddleware';
import { router as ordersRouter } from './features/orders/routes';
import { router as productsRouter } from './features/products/routes';
import { router as reportsRouter } from './features/reports/routes';
import { router as supportRouter } from './features/support/routes';
import { router as usersRouter } from './features/users/routes';
import { rateLimitMiddleware } from './middlewares/rateLimitMiddleware';
import { requestLoggingMiddleware } from './middlewares/requesteLoggingMiddleware';
import { userBlockingkMiddleware } from './middlewares/userBlockingMiddleware';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());

// https://expressjs.com/en/guide/behind-proxies.html
// When running behind a proxy like Nginx, the client IP address is taken from the x-forwarded-for header
// app.set('trust proxy', 1);
// without trust: IP: LB - x-real-ip: local - x-forwarded-for: local, CDN
// with trust: IP: local - x-real-ip: local - x-forwarded-for: local, CDN
app.use(requestLoggingMiddleware);

// Apply the rate limiting middleware to all requests.
// app.use(rateLimitMiddleware);

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
