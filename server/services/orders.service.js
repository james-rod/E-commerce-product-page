import { create, findByUser, findById, updateStatus, markAsPaid } from "../models/order.model.js";
import { getCartWithItems, clearCart } from "../models/cart.model.js";
import stripe from "../config/stripe.js";

export async function placeOrder(userId) {
  const cart = await getCartWithItems(userId);
  if (!cart.items.length) throw new Error("Cart is empty");

  const totalCents = cart.items.reduce((sum, item) => {
    const discounted = Math.round(item.price_cents * (1 - item.discount_pct / 100));
    return sum + discounted * item.qty;
  }, 0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { userId: String(userId) },
  });

  const order = await create(userId, cart.items, totalCents, paymentIntent.id, paymentIntent.client_secret);
  await clearCart(userId);
  return { order, clientSecret: paymentIntent.client_secret };
}

export async function confirmOrderPaid(paymentIntentId) {
  return markAsPaid(paymentIntentId);
}

export const getOrders = (userId) => findByUser(userId);

export async function getOrderById(id) {
  const order = await findById(id);
  if (!order) throw new Error("Order not found");
  return order;
}

export const updateOrderStatus = (id, status) => updateStatus(id, status);
