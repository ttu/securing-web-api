import express, { Request, Response, Router } from 'express';
import { startServer } from './cache/cacheRedis';
import { usersRouter } from './features/users/routes';

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.CACHE === 'redis') {
  startServer().then(() => {
    console.log('Redis server started');
  });
}

const apiRouter = Router();
apiRouter.use('/users', usersRouter);

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
