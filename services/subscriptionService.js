const Stripe = require('stripe');
const User = require('../models/User');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// This function is adapted from the user's `subscriptions.js` lib
async function updateSubscription(updateData) {
  const { userId, ...rest } = updateData;
  // Make sure to map the fields correctly to the User model
  const mappedData = {
    stripeCustomerId: rest.stripeCustomerId,
    stripeSubscriptionId: rest.stripeSubscriptionId,
    stripePriceId: rest.stripePriceId,
    stripeCurrentPeriodEnd: rest.stripeCurrentPeriodEnd,
    subscriptionPlan: rest.plan,
    subscriptionStatus: rest.status,
    currentPeriodEnd: rest.currentPeriodEnd,
    cancelAtPeriodEnd: rest.cancelAtPeriodEnd
  };

  // Remove undefined fields
  Object.keys(mappedData).forEach(key => mappedData[key] === undefined && delete mappedData[key]);

  await User.findByIdAndUpdate(userId, mappedData);
}

// This function is adapted from the user's `subscriptions.js` lib
async function createStripeCheckoutSession(userId, email, priceId) {
  let customerId;

  const user = await User.findById(userId);
  if (user?.stripeCustomerId) {
    customerId = user.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email,
      metadata: { userId: userId.toString() }
    });
    customerId = customer.id;
    await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.CLIENT_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/billing`, // Assuming a billing page exists on the client
    client_reference_id: userId.toString(),
    subscription_data: {
      trial_period_days: 14,
      metadata: { userId: userId.toString() }
    }
  });

  return session;
}

// This function is adapted from the user's `subscriptions.js` lib
async function createStripeBillingPortalSession(customerId) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.CLIENT_URL}/billing`
  });
  return session;
}

module.exports = {
  stripe,
  updateSubscription,
  createStripeCheckoutSession,
  createStripeBillingPortalSession
};
