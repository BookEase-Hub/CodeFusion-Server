import express from 'express';
import { BotEngine } from '../services/BotEngine';

const router = express.Router();
const botEngine = new BotEngine();

import { Request, Response } from 'express';

router.post('/bot-command', async (req: Request, res: Response) => {
  try {
    const { query, sessionId } = req.body;
    const result = await botEngine.processQuery(query);
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
