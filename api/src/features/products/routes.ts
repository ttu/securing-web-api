import { Request, Response, Router } from 'express';
import { getProducts, getPrices } from './service';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const products = await getProducts();
  return res.json(products);
});

router.get('/prices', async (req: Request, res: Response) => {
  const products = await getPrices();
  return res.json(products);
});

router.post('/admin/prices', async (req: Request, res: Response) => {
  return res.status(501).send('Not implemented');
});
