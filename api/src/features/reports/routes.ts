import { Request, Response, Router } from 'express';

import { authMiddleware } from '../../middlewares/authMiddleware';
import { blockingSleep } from '../../utils';

export const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  console.log('Reports - Generating report with a blocking operation');

  // Fetch data from other services
  blockingSleep(8000);

  const reportData = {
    totalOrders: 100,
    totalRevenue: 1000,
    totalCustomers: 10,
  };

  return res.json(reportData);
});
