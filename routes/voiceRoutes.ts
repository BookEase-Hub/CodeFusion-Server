import express from 'express';
import { VoiceProcessor } from '../services/VoiceProcessor';

const router = express.Router();
const voiceProcessor = new VoiceProcessor();

import { Request, Response } from 'express';

router.post('/process-voice', async (req: Request, res: Response) => {
  try {
    const { transcript, sessionId } = req.body;
    const result = await voiceProcessor.processTranscript(transcript, { sessionId });
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
