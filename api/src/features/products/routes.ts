import { Request, Response, Router } from 'express';

import { getProducts, getPrices, updatePrices, getCatalog } from './service';
import { convertToProductPrice, hasValidProductPrice, isValidPriceDataJson } from './types';
import { longCacheMiddlware } from '../../cache/cacheControlMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';

export const router = Router();

router.get('/details', longCacheMiddlware, async (req: Request, res: Response) => {
  const products = await getProducts();
  return res.json(products);
});

router.get('/prices', async (req: Request, res: Response) => {
  const products = await getPrices();
  return res.json(products);
});

router.post('/admin/prices', authMiddleware, async (req: Request, res: Response) => {
  const priceData = req.body;

  if (!isValidPriceDataJson(priceData)) return res.status(400).json({ error: 'Invalid price data format.' });
  if (!hasValidProductPrice(priceData)) return res.status(422).json({ error: 'Invalid product pricing.' });

  // TODO: Middlware could convert the Date strings to Date objects
  const priceUpdateData = convertToProductPrice(priceData);
  const result = await updatePrices(priceUpdateData);
  return res.json(result);
});

router.get('/catalog/:country', async (req: Request, res: Response) => {
  const { country } = req.params;
  // Should validate country and return 400 if invalid

  const catalog = await getCatalog(country);

  if (catalog.length === 0) return res.status(404).json({ error: 'Catalog not found for country' });

  return res.json(catalog);
});
