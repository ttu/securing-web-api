import { Request, Response, Router } from 'express';
import { getProducts, getPrices, updatePrices } from './service';
import { ProductPrice } from './types';
import { authMiddleware } from '../../middlewares/authMiddleware';
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

router.post('/admin/prices', authMiddleware, async (req: Request, res: Response) => {
  const priceUpdateData = req.body;

  if (!isValidPriceData(priceUpdateData)) return res.status(400).send('Invalid price data');

  // eventEmitter.emit(Events.PRICE_UPDATE, priceUpdateData);
  // return res.json(true);

  const result = await updatePrices(priceUpdateData);
  return res.json(result);
});

router.get('/catalog', async (req: Request, res: Response) => {
  // TODO: This endpoint will return a product catalog with all product and current prices
  return res.status(501).send('Not implemented');
});

const isValidPriceData = (data: ProductPrice[]) => {
  return (
    data.length > 0 &&
    data.every(
      ({ productId, price, country, ...extra }) =>
        typeof productId === 'number' &&
        productId > 0 &&
        typeof price === 'number' &&
        price > 0 &&
        typeof country === 'string' &&
        country.trim() !== '' &&
        Object.keys(extra).length === 0 // No extra properties
    )
  );
};
