import { Request, Response, Router } from 'express';

import pool from '../../db';

export const router = Router();

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

  const ip = req.ip;
  const now = Date.now();

  const toStore: StoredMessage = { sender: message.sender, message: message.message, timestamp: now, ip: ip || '' };
  await insertMessage(toStore);

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
