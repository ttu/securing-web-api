import { Request, Response, Router } from 'express';
import { getProducts, getPrices, updatePrices } from './service';
// import { eventEmitter, Events } from './subscribers';

export const router = Router();

router.get('/details', async (req: Request, res: Response) => {
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

router.get('/catalog', async (req: Request, res: Response) => {
  // TODO: This endpoint will return a product catalog with all product and current prices
  return res.status(501).send('Not implemented');
});
