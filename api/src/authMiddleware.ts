import { NextFunction, Request, Response } from 'express';
import { isUserBlocked } from './userBlockingMiddleware';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  // Assuming 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token is missing');
  }

  // Token is a user ID
  // Check that token is a number
  if (isNaN(Number(token))) {
    return res.status(401).send('Invalid token');
  }

  req.userId = parseInt(token);

  // NOTE: In reality token should be verified using JWT
  //   try {
  //     const decoded = jwt.verify(token, 'wrong-secret');
  //     // TODO: Fetch user
  //     req.user = decoded;
  //   } catch (err) {
  //     return res.status(403).send('Invalid token');
  //   }

  if (isUserBlocked(req.userId)) {
    return res.status(403).send('User is blocked');
  }

  next();
};
