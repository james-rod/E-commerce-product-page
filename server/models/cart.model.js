import pool from "../config/db.js";

async function getOrCreateCart(userId) {
  await pool.query(
    "INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
    [userId]
  );
  const { rows } = await pool.query(
    "SELECT * FROM carts WHERE user_id = $1",
    [userId]
  );
  return rows[0];
}

export async function getCartWithItems(userId) {
  const cart = await getOrCreateCart(userId);
  const { rows } = await pool.query(
    `SELECT
       ci.id,
       ci.product_id,
       ci.qty,
       p.name,
       p.price_cents,
       p.discount_pct
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1
     ORDER BY ci.id`,
    [cart.id]
  );
  return { ...cart, items: rows };
}

export async function upsertItem(userId, productId, qty) {
  const cart = await getOrCreateCart(userId);
  const { rows } = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, qty)
     VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id) DO UPDATE SET qty = $3
     RETURNING *`,
    [cart.id, productId, qty]
  );
  await pool.query(
    "UPDATE carts SET updated_at = NOW() WHERE id = $1",
    [cart.id]
  );
  return rows[0];
}

export async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  await pool.query(
    "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
    [cart.id, productId]
  );
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);
}
