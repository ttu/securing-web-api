import { NextFunction, Request, Response } from 'express';

import * as cache from './cache';

export const cacheMiddleware = (durationInSec: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for authenticated routes and POST requests
    // NOTE: For authenticated routes, we should cache per user
    if (req.headers.authorization || req.method === 'POST') {
      next();
      return;
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cacheContent = await cache.get(key);
    if (cacheContent) {
      console.log('Cache hit from middleware: key', key);
      // NOTE: For now we just assume that the cached content is JSON
      res.setHeader('Content-Type', 'application/json');
      res.send(cacheContent);
      return;
    }

    // Save the original res.send method with proper context
    const originalSend = res.send.bind(res);

    // @ts-expect-error res.send would require more complex typing
    res.send = async (body: unknown) => {
      // Cache only successful responses
      if (res.statusCode < 400) {
        await cache.add(key, body, durationInSec);
      }

      originalSend(body); // Call the original res.send method
    };

    next();
  };
};
