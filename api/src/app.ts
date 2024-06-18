import express, { Request, Response } from 'express';
import { getUser, getUsers } from './service';
import { startServer } from './cache/cacheRedis';

const app = express();
const PORT = process.env.PORT || 3000;

if (process.env.CACHE === 'redis') {
  startServer().then(() => {
    console.log('Redis server started');
  });
}

app.get('/', (req: Request, res: Response) => {
  return res.send('Hello World with TypeScript!');
});

app.get('/api/user', async (req: Request, res: Response) => {
  const users = await getUsers();
  return res.json(users);
});

app.get('/api/user/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const user = await getUser(id);
  return user ? res.json(user) : res.status(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
