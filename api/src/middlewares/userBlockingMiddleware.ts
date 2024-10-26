import { NextFunction, Request, Response } from 'express';

export const userBlockingMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.ip) {
    if (isIpBlocked(req.ip)) {
      return res.status(403).send('IP is blocked');
    }
  }

  next();
};

const BLOCKED_IPS = ['156.100.100.1'];

const isIpBlocked = (ip: string) => {
  return BLOCKED_IPS.includes(ip);
};

const BLOCKED_USERS = [10, 44];

// NOTE: As userId is set in the authMiddleware, we can access it only after the authMiddleware is called
export const isUserBlocked = (userId: number) => {
  return BLOCKED_USERS.includes(userId);
};
