import {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/orders.service.js";

export async function placeOrderController(req, res) {
  try {
    const { order, clientSecret } = await placeOrder(req.user.id);
    res.status(201).json({ order, clientSecret });
  } catch (err) {
    const status = err.message === "Cart is empty" ? 400 : 500;
    res.status(status).json({ error: err.message });
  }
}

export async function getOrdersController(req, res) {
  try {
    const orders = await getOrders(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getOrderByIdController(req, res) {
  try {
    const order = await getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    const status = err.message === "Order not found" ? 404 : 500;
    res.status(status).json({ error: err.message });
  }
}

export async function updateOrderStatusController(req, res) {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }
  try {
    const order = await updateOrderStatus(req.params.id, status);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
