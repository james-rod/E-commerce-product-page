import {
  getCart,
  addOrUpdateItem,
  deleteItem,
  emptyCart,
} from "../services/cart.service.js";

export async function getCartController(req, res) {
  try {
    const cart = await getCart(req.user.id);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function upsertItemController(req, res) {
  const { productId, qty } = req.body;
  if (!productId || !qty) {
    return res.status(400).json({ error: "productId and qty are required" });
  }
  try {
    const item = await addOrUpdateItem(req.user.id, productId, qty);
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function removeItemController(req, res) {
  try {
    await deleteItem(req.user.id, req.params.productId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function clearCartController(req, res) {
  try {
    await emptyCart(req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
