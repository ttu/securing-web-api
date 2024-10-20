import { NextFunction, Request, Response } from 'express';

import * as cache from './cache';

// Application wide cache middleware
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

// Cache middleware for route level caching
// NOTE: Cache should have an optional cache key as we might need to invalidate cache in some cases
export const routeCache = (durationInSec: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const prefix = `__express__${req.originalUrl || req.url}`;
    const key = req.userId ? `${prefix}__user__${req.userId}` : prefix;

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
