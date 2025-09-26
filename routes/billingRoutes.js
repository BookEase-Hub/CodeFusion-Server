const { Router } = require('express');
const { protect } = require('../controllers/authController');
const { processCreditCard } = require('../controllers/billingController');

const router = Router();

// Protected route: only authenticated users can submit card details
router.post('/process-card', protect, processCreditCard);

module.exports = router;