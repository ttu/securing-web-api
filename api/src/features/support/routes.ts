import { Request, Response, Router } from 'express';

import * as cache from '../../cache/cache';
import pool from '../../db';

export const router = Router();

const MESSAGES_IDEMPOTENCY_KEY = 'messages';

type Message = {
  message: string;
  sender: string;
};

type StoredMessage = Message & {
  timestamp: number;
  ip: string;
};

router.post('/messages', async (req: Request, res: Response) => {
  console.log('Messages - Creating new message');

  const message = req.body.message as Message;

  if (!message || !message.message || !message.sender) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  // If sender has sent message in last x seconds, reject
  if (await rejectFromSender(message.sender)) {
    // return res.status(429).json({ error: 'Too many requests' });
    return res.json({ status: 'ok' });
  }

  const ip = req.ip;
  const now = Date.now();

  const toStore: StoredMessage = { sender: message.sender, message: message.message, timestamp: now, ip: ip || '' };
  await insertMessage(toStore);

  await addSenderToBlocked(message.sender);

  return res.json({ status: 'ok' });
});

const insertMessage = async (message: StoredMessage) => {
  console.log('Message:', message);

  const { message: msg, sender, timestamp, ip } = message;

  const query = `
    INSERT INTO messages (message, sender, timestamp, ip)
    VALUES ($1, $2, $3, $4)
  `;

  try {
    await pool.query(query, [msg, sender, timestamp, ip]);
    console.log('Message inserted successfully');
  } catch (error) {
    console.error('Error inserting message:', error);
    throw error;
  }
};

// Block messages from same sender for 20 seconds
const addSenderToBlocked = async (sender: string) => {
  await cache.add(`${MESSAGES_IDEMPOTENCY_KEY}_${sender}`, true, 20);
};

const rejectFromSender = async (sender: string): Promise<boolean> => {
  const hasJustSent = await cache.get(`${MESSAGES_IDEMPOTENCY_KEY}_${sender}`);
  return hasJustSent ? true : false;
};
