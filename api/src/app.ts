import express, { Request, Response, Router } from 'express';
import { startServer } from './cache/cacheRedis';
import { router as usersRouter } from './features/users/routes';
import { cacheMiddleware } from './cache/cacheMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.CACHE === 'redis') {
  startServer().then(() => {
    console.log('Redis server started');
  });
}

// NOTE: For authenticatiod routes, we should not cache the response
app.use(cacheMiddleware(5));

const apiRouter = Router();
apiRouter.use('/users', usersRouter);

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
