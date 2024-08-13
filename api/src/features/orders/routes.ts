import { Request, Response, Router } from 'express';
import { createOrder, getOrders } from './service';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { Order } from './types';

export const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const orders = await getOrders(userId);
  return res.json(orders);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const orderData: Order = req.body;

  const order = await createOrder(userId, orderData);
  return res.json(order);
});
