import express from 'express';
import * as cache from './cache';

export const cacheMiddleware = (durationInSec: number) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // NOTE: For authenticatiod routes, we should not cache the response
    if (req.method === 'POST') {
      next();
      return;
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cacheContent = await cache.get(key);
    if (cacheContent) {
      console.log('Cache hit from middleware');
      // NOTE: For now we just assume that the cached content is JSON
      res.setHeader('Content-Type', 'application/json');
      res.send(cacheContent);
      return;
    }

    // Save the original res.send method with proper context
    const originalSend = res.send.bind(res);

    // @ts-ignore
    res.send = async (body: any) => {
      await cache.add(key, body, durationInSec);
      originalSend(body); // Call the original res.send method
    };

    next();
  };
};
