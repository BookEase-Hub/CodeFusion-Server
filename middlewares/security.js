const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const helmet = require('helmet');

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// CSRF protection
const csrfProtection = csrf({ cookie: true });

// Security headers
const securityHeaders = (req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${nonce}'`, 'cdn.jsdelivr.net'],
        styleSrc: ["'self'", 'cdn.jsdelivr.net'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'api.continue.dev']
      }
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    }
  })(req, res, next);
};

module.exports = { apiLimiter, csrfProtection, securityHeaders };
