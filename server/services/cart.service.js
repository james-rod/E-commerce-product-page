import {
  getCartWithItems,
  upsertItem,
  removeItem,
  clearCart,
} from "../models/cart.model.js";

export const getCart = (userId) => getCartWithItems(userId);

export const addOrUpdateItem = (userId, productId, qty) =>
  upsertItem(userId, productId, qty);

export const deleteItem = (userId, productId) => removeItem(userId, productId);

export const emptyCart = (userId) => clearCart(userId);
