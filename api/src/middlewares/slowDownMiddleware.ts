import { NextFunction, Request, Response } from 'express';

import { blockingSleep } from '../utils';

// In real life scenarios backends are slower than example code
// To simulate this, we add blocking of 1ms to all requests
// This means that even on optimal scenario, the backend can handle 1000 requests per second
const slowDownMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  blockingSleep(1);
  next();
};

export { slowDownMiddleware };
