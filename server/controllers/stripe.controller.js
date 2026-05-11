import stripe from '../config/stripe.js';
import { confirmOrderPaid } from '../services/orders.service.js';

export async function handleWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET.trim()
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'payment_intent.succeeded') {
    try {
      await confirmOrderPaid(event.data.object.id);
    } catch (err) {
      console.error('Failed to mark order as paid:', err.message);
    }
  }

  res.status(200).json({ received: true });
}
