import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const wc = process.env.STRIPE_WEBHOOK_ID;
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Validate required environment variables
if (!endpointSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is required');
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.amount_capturable_updated':
                // Handle event
                break;
            case 'payment_intent.canceled':
                const paymentIntentCanceled = event.data.object;
                // Then define and call a function to handle the event payment_intent.canceled
                break;
            case 'payment_intent.created':
                const paymentIntentCreated = event.data.object;
                // Then define and call a function to handle the event payment_intent.created
                break;
            case 'payment_intent.partially_funded':
                const paymentIntentPartiallyFunded = event.data.object;
                // Then define and call a function to handle the event payment_intent.partially_funded
                break;
            case 'payment_intent.payment_failed':
                const paymentIntentPaymentFailed = event.data.object;
                // Then define and call a function to handle the event payment_intent.payment_failed
                break;
            case 'payment_intent.processing':
                const paymentIntentProcessing = event.data.object;
                // Then define and call a function to handle the event payment_intent.processing
                break;
            case 'payment_intent.requires_action':
                const paymentIntentRequiresAction = event.data.object;
                // Then define and call a function to handle the event payment_intent.requires_action
                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                // Then define and call a function to handle the event payment_intent.succeeded
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a response to acknowledge receipt of the event
        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
} 