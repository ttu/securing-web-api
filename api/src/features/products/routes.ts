import { Request, Response, Router } from 'express';

import { getProducts, getPrices, updatePrices, getCatalog } from './service';
import { convertToProductPrice, isValidPriceDataJson } from './types';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.get('/details', async (req: Request, res: Response) => {
  const products = await getProducts();
  return res.json(products);
});

router.get('/prices', async (req: Request, res: Response) => {
  const products = await getPrices();
  return res.json(products);
});

router.post('/admin/prices', authMiddleware, async (req: Request, res: Response) => {
  const priceData = req.body;

  if (!isValidPriceDataJson(priceData)) return res.status(400).send('Invalid price data');

  // TODO: Middlware could convert the Date strings to Date objects
  const priceUpdateData = convertToProductPrice(priceData);
  const result = await updatePrices(priceUpdateData);
  return res.json(result);
});

router.get('/catalog/:country', async (req: Request, res: Response) => {
  const { country } = req.params;
  const catalog = await getCatalog(country);
  return res.json(catalog);
});
