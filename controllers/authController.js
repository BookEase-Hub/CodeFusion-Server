const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/User');
const AppError = require('../utils/errorHandler');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // The password will be hashed by the pre-save middleware in the User model
    const newUser = await User.create({
      username,
      email,
      password
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    // Handle duplicate email error
    if (err.code === 11000) {
        return next(new AppError('An account with this email or username already exists.', 400));
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password!', 400));
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);

    } catch (err) {
        next(err);
    }
};

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(
            new AppError('You are not logged in! Please log in to get access.', 401)
            );
        }

        // 2) Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
            );
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        next(err);
    }
};

// Note: The other functions from the original authController (updateProfile, etc.)
// are not included in the user's provided snippets. I am focusing on the core
// auth logic (signup, login, protect). The router in `api.js` will need to be
// updated to remove routes for functions that no longer exist, or I would need
// to implement them. Given the scope, I will focus on the core auth and assume
// the other routes will be handled later or removed.
// For now, I will add placeholder functions for the other routes to prevent crashes.

exports.getCurrentUser = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

exports.updateProfile = (req, res, next) => next(new AppError('This route is not yet implemented!', 501));
exports.updateAvatar = (req, res, next) => next(new AppError('This route is not yet implemented!', 501));
