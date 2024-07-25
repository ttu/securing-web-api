import { Request, Response, Router } from 'express';
import { getProducts, getPrices, updatePrices } from './service';
// import { eventEmitter, Events } from './subscribers';

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
  const priceUpdateData = req.body;
  // eventEmitter.emit(Events.PRICE_UPDATE, priceUpdateData);
  // return res.json(true);
  const result = await updatePrices(priceUpdateData);
  return res.json(result);
});
