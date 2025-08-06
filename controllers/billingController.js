const User = require('../models/User');
const AppError = require('../utils/errorHandler');
const {
    stripe,
    updateSubscription,
    createStripeCheckoutSession,
    createStripeBillingPortalSession
} = require('../services/subscriptionService');


exports.createCheckoutSession = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const priceId = process.env.STRIPE_PREMIUM_PRICE_ID;

        if (!priceId) {
            return next(new AppError('Stripe price ID is not configured.', 500));
        }

        const session = await createStripeCheckoutSession(userId, userEmail, priceId);

        res.status(200).json({
            status: 'success',
            url: session.url
        });
    } catch (err) {
        next(err);
    }
};

exports.createPortalSession = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.stripeCustomerId) {
            return next(new AppError('User does not have a subscription or customer ID.', 400));
        }
        const session = await createStripeBillingPortalSession(user.stripeCustomerId);
        res.status(200).json({
            status: 'success',
            url: session.url
        });
    } catch (err) {
        next(err);
    }
};

exports.handleWebhook = async (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // The raw body
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const sub = await stripe.subscriptions.retrieve(session.subscription);
                await updateSubscription({
                    userId: session.client_reference_id,
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: sub.id,
                    stripePriceId: sub.items.data[0].price.id,
                    plan: 'premium',
                    status: sub.status,
                    stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000)
                });
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                const user = await User.findOne({ stripeCustomerId: invoice.customer });
                if (user) {
                    await updateSubscription({
                        userId: user._id.toString(),
                        status: 'active',
                        currentPeriodEnd: new Date(invoice.lines.data[0].period.end * 1000)
                    });
                }
                break;

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                const userToUpdate = await User.findOne({ stripeSubscriptionId: subscription.id });
                if (userToUpdate) {
                    await updateSubscription({
                        userId: userToUpdate._id.toString(),
                        status: subscription.status,
                        plan: subscription.cancel_at_period_end ? 'premium' : (subscription.status === 'canceled' ? 'free' : 'premium'),
                        cancelAtPeriodEnd: subscription.cancel_at_period_end
                    });
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Webhook handler error:', error);
        // Do not send error to Stripe, just log it. Stripe will retry if it doesn't get a 200.
    }

    res.status(200).json({ received: true });
};
