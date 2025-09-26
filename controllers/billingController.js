const { creditCardSchema } = require('../models/CreditCard');
const User = require('../models/User');
const AppError = require('../utils/errorHandler');

/**
 * Mock function to simulate a payment processor (e.g., internal ledger, third-party gateway).
 * In real life, you'd integrate with a PCI-compliant service (e.g., Stripe, Adyen).
 * NEVER implement raw card processing yourself.
 */
async function processPaymentMock(cardData, amount) {
  // Simulate 95% success rate
  if (Math.random() > 0.05) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }
  return { success: false };
}

/**
 * POST /api/v1/billing/process-card
 * Processes a credit card payment without storing sensitive data.
 */
const processCreditCard = async (req, res, next) => {
  try {
    // 1. Validate input
    const { error, value } = creditCardSchema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validation failed',
        errors: error.details.map((err) => err.message),
      });
    }

    // 2. Extract NON-SENSITIVE data for business logic
    const { name, email, address, city, country, postalCode } = value;

    // 3. NEVER log or store cardNumber, expiry, cvc
    const { cardNumber, expiry, cvc } = value; // Destructure but DO NOT USE beyond validation

    // 4. Verify user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // 5. Process mock payment (in real app, send to payment gateway)
    const paymentResult = await processPaymentMock({ name, email }, 15.0); // $15/month

    if (!paymentResult.success) {
      return res.status(402).json({
        status: 'fail',
        message: 'Payment declined. Please check your card details.',
      });
    }

    // 6. Update user subscription (non-sensitive)
    user.subscriptionPlan = 'premium';
    user.subscriptionStatus = 'active';
    await user.save();

    // 7. Respond WITHOUT sensitive data
    res.status(200).json({
      status: 'success',
      message: 'Payment processed successfully',
      data: {
        transactionId: paymentResult.transactionId,
        plan: 'premium',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (err) {
    // Ensure no sensitive data leaks in error
    console.error('Payment processing error (non-sensitive):', err.message);
    return next(new AppError('Payment processing failed', 500));
  }
};

module.exports = { processCreditCard };