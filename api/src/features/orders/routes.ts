import { Request, Response, Router } from 'express';

import { createOrder, getOrders } from './service';
import { hasValidOrderData, isValidOrderDto } from './types';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const orders = await getOrders(userId);
  return res.json(orders);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const userId = req.userId!;
  const orderData = req.body;

  if (!isValidOrderDto(orderData)) return res.status(400).json({ error: 'Invalid order data format' });
  if (!hasValidOrderData(orderData)) return res.status(422).json({ error: 'Invalid order data.' });

  const order = await createOrder(userId, orderData);
  return res.json(order);
});
