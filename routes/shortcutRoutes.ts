import express from 'express';
import { ShortcutManager } from '../services/ShortcutManager';

const router = express.Router();
const shortcutManager = new ShortcutManager();

import { Request, Response } from 'express';

router.post('/set-shortcut', (req: Request, res: Response) => {
  const { userId, shortcut, command } = req.body;
  shortcutManager.setShortcut(userId, shortcut, command);
  res.json({ success: true });
});

router.get('/get-shortcuts/:userId', (req: Request, res: Response) => {
  const shortcuts = shortcutManager.getUserShortcuts(req.params.userId);
  res.json(shortcuts);
});

export default router;
