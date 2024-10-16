import { NextFunction, Request, Response } from 'express';

// Cache control headers for use browsers and shared caches (e.g. Proxies, CDNs)
// https://developers.cloudflare.com/cache/concepts/cache-control/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// https://www.npmjs.com/package/express-cache-headers

// Cache for 1 minute
const shortCacheMiddlware = async (req: Request, res: Response, next: NextFunction) => {
  next();
  res.set('Cache-Control', 'public, max-age=60');
};

// Cache for 10 minutes
const longCacheMiddlware = async (req: Request, res: Response, next: NextFunction) => {
  next();
  res.set('Cache-Control', 'public, max-age=600');
};

const noCacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  next();
  res.set('Cache-Control', 'no-store');
};

export { shortCacheMiddlware, longCacheMiddlware, noCacheMiddleware };
