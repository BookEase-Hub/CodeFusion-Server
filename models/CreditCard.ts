import Joi from 'joi';

/**
 * Validates credit card input without storing sensitive data.
 * PCI DSS compliance: Never log or persist full PAN, CVV, or expiry.
 */
export const creditCardSchema = Joi.object({
  // Cardholder name (non-sensitive)
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Cardholder name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),

  // Email for receipt (non-sensitive)
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
  }),

  // Billing address (non-sensitive)
  address: Joi.string().trim().min(5).max(100).required(),
  city: Joi.string().trim().min(2).max(50).required(),
  country: Joi.string().trim().min(2).max(50).required(),
  postalCode: Joi.string()
    .pattern(/^[A-Za-z0-9\s\-]{3,10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid postal code format',
    }),

  // Card number (sensitive – validated but NOT stored)
  cardNumber: Joi.string()
    .pattern(/^(\d{4}[\s\-]?){3}\d{4}$/) // Accepts 1234 5678 9012 3456 or 1234-5678-9012-3456
    .required()
    .messages({
      'string.pattern.base': 'Invalid card number format',
    }),

  // Expiry date (sensitive – validated but NOT stored)
  expiry: Joi.string()
    .pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/) // MM/YY or MMYY
    .required()
    .custom((value, helpers) => {
      const [monthStr, yearStr] = value.split(/\/?/);
      const month = parseInt(monthStr, 10);
      const year = parseInt(`20${yearStr}`, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return helpers.message('Card is expired');
      }
      return value;
    })
    .messages({
      'string.pattern.base': 'Expiry must be in MM/YY format',
    }),

  // CVV (sensitive – validated but NOT stored)
  cvc: Joi.string()
    .pattern(/^\d{3,4}$/) // 3 digits for Visa/MC, 4 for Amex
    .required()
    .messages({
      'string.pattern.base': 'CVC must be 3 or 4 digits',
    }),
});