import { NextFunction, Request, Response } from 'express';

const requestLoggingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { ip, method, url } = req;
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - x-real-ip: ${realIp} - x-forwarded-for: ${forwardedFor}`);
  next();
};

export { requestLoggingMiddleware };
