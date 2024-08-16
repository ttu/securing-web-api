import { Request, Response, Router } from 'express';

import { getUser, getUsers } from './service';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const users = await getUsers();
  return res.json(users);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const user = await getUser(id);
  return user ? res.json(user) : res.status(404).send('User not found');
});
