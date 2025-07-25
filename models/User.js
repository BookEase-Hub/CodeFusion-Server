const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: false },
  avatar: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  subscriptionPlan: { type: String, enum: ['free', 'premium'], default: 'free' },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'trial'],
    default: 'trial'
  },
  trialEndsAt: { type: Date },
  billingInfo: {
    address: { type: String },
    city: { type: String },
    country: { type: String },
    postalCode: { type: String }
  },
  linkedAccounts: [{
    provider: { type: String },
    accountId: { type: String },
    accessToken: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
