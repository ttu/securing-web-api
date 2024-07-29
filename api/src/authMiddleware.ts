import express from 'express';
import { Request, Response } from 'express';

export const authMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Authorization header is missing');
  }

  // Assuming 'Bearer <token>' format
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Token is missing');
  }

  // Verify token using JWT
  //   try {
  //     const decoded = jwt.verify(token, 'wrong-secret');
  //     // TODO: Fetch user
  //     req.user = decoded;
  //   } catch (err) {
  //     return res.status(403).send('Invalid token');
  //   }

  next();
};
