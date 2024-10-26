import { Request, Response, Router } from 'express';

import { getProducts, getPrices, updatePrices, getCatalog } from './service';
import { convertToProductPrice, hasValidProductPrice, isValidPriceDataJson } from './types';
import { shortCacheMiddleware } from '../../cache/cacheControlMiddleware';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { sleep } from '../../utils';

export const router = Router();

router.get('/details', async (req: Request, res: Response) => {
  const products = await getProducts();

  // EXAMPLE: Disable the ETag and show how the browser cache works with Last-Modified
  // res.set('Last-Modified', 'Sat, 19 Oct 2024 13:48:08 GMT'); // You can replace this with the actual last modified date
  // EXAMPLE: Simulate a slow response
  // await sleep(10000);
  // EXAMPLE: Simulate an error from the server
  // return res.status(500).json({ error: 'Internal server error' });

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

  // TODO: Middleware could convert the Date strings to Date objects
  const priceUpdateData = convertToProductPrice(priceData);
  await updatePrices(priceUpdateData);
  return res.status(201);
});

router.get('/catalog/:country', async (req: Request, res: Response) => {
  const { country } = req.params;
  // Should validate country and return 400 if invalid

  const catalog = await getCatalog(country);

  if (catalog.length === 0) return res.status(404).json({ error: 'Catalog not found for country' });

  return res.json(catalog);
});
