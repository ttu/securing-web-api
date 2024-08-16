import { Request, Response, Router } from 'express';

export const router = Router();

const MESSAGES = [];

type Message = {
  message: string;
  sender: string;
};

type StoredMessage = Message & {
  timestamp: number;
  ip: string;
};

router.post('/messages', async (req: Request, res: Response) => {
  console.log('Messages - Creating a new message t');

  const message = req.body.message as Message;

  if (!message || !message.message || !message.sender) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const ip = req.ip;
  const now = Date.now();

  // TODO: Implement duplicate message check

  const toStore = { ...message, timestamp: now, ip: ip } as StoredMessage;

  console.log('Message:', toStore);
  MESSAGES.push(toStore);

  return res.json({ status: 'ok' });
});
