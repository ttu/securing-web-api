import { Request, Response, Router } from 'express';
import { getUser, getUsers } from './service';

export const usersRouter = Router();

usersRouter.get('/user', async (req: Request, res: Response) => {
  const users = await getUsers();
  return res.json(users);
});

usersRouter.get('/user/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const user = await getUser(id);
  return user ? res.json(user) : res.status(404);
});
