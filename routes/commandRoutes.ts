import express from 'express';
import { CommandDispatcher } from '../services/CommandDispatcher';
import { AuthService } from '../services/AuthService';

const router = express.Router();
const commandDispatcher = new CommandDispatcher();
const authService = new AuthService();

import { Request, Response } from 'express';

router.post('/execute-command', async (req: Request, res: Response) => {
  const { command, context, sessionId } = req.body;
  const user = await authService.authenticate(sessionId);
  if (user) {
    try {
      const result = await commandDispatcher.executeCommand(command, context);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;
