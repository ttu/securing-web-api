import { NextFunction, Request, Response } from 'express';

// Cache control headers for use browsers and shared caches (e.g. Proxies, CDNs)
// https://developers.cloudflare.com/cache/concepts/cache-control/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
// https://www.npmjs.com/package/express-cache-headers

// CDNs etc. often suppors good configuration for cache control based on response status codes
// In this infrastructure, NGINX doesn't have support for cache control based on status codes
// Due to this, this middleware is overly complex as it has to handle cache control based on status codes

// Cache 200 responses for a longer time, based on how often the content changes.
// Cache 300 responses for a short time, as redirects are often temporary .
// Cache 400-series responses for a short duration since client errors typically won’t change frequently (e.g. 1 minute).
// Cache 500-series responses for a very short period to allow time for server recovery while minimizing stale responses (e.g. 30 seconds to 1 minute).

// For demonstration purposes, caching durations are shorter than in a real-world scenario

// Cache for 10 seconds
const shortCacheMiddlware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return cacheMiddleware(req, res, next, 'public, max-age=10');
  };
};

// Cache for 30 seconds
const longCacheMiddlware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return cacheMiddleware(req, res, next, 'public, max-age=30');
  };
};

const noCacheMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return cacheMiddleware(req, res, next, 'no-store');
  };
};

const cacheMiddleware = (req: Request, res: Response, next: NextFunction, cacheDefault: string) => {
  // const originalSend = res.send.bind(res);
  // const originalJson = res.json.bind(res);
  const originalEnd = res.end.bind(res);

  // TODO: is res.end enough?
  // res.send = (body) => {
  // res.json = (body) => {

  // Override res.end (for other cases)
  // @ts-expect-error res.end would require more complex typing
  res.end = (chunk, encoding) => {
    const value = getCacheControlValue(res.statusCode, cacheDefault);
    res.set('Cache-Control', value);
    // @ts-expect-error no overload matches this call
    return originalEnd(chunk, encoding);
  };

  next();
};

const getCacheControlValue = (statusCode: number, okValue: string) => {
  if (statusCode >= 300 && statusCode < 400) {
    return 'public, max-age=60';
  }
  if (statusCode >= 400 && statusCode < 500) {
    return 'public, max-age=60';
  }
  if (statusCode >= 500 && statusCode < 600) {
    return 'public, max-age=30';
  }
  return okValue;
};

export { shortCacheMiddlware, longCacheMiddlware, noCacheMiddleware };
