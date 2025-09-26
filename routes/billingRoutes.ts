import { Router } from 'express';
import { protect } from '../controllers/authController';
import { processCreditCard } from '../controllers/billingController';

const router = Router();

// Protected route: only authenticated users can submit card details
router.post('/process-card', protect, processCreditCard);

export default router;