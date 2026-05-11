import pool from "../config/db.js";

export async function create(userId, items, totalCents, stripePaymentIntentId, stripeClientSecret) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total_cents, status, stripe_payment_intent_id, stripe_client_secret)
       VALUES ($1, $2, 'pending_payment', $3, $4) RETURNING *`,
      [userId, totalCents, stripePaymentIntentId, stripeClientSecret]
    );

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, price_cents, qty)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.price_cents, item.qty]
      );
    }

    await client.query("COMMIT");
    return findById(order.id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function findByUser(userId) {
  const { rows } = await pool.query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT
       o.*,
       oi.id          AS item_id,
       oi.product_id,
       oi.product_name,
       oi.price_cents AS item_price_cents,
       oi.qty
     FROM orders o
     LEFT JOIN order_items oi ON oi.order_id = o.id
     WHERE o.id = $1`,
    [id]
  );
  if (!rows.length) return null;

  const { item_id, product_id, product_name, item_price_cents, qty, ...order } = rows[0];
  const result = { ...order, items: [] };
  for (const row of rows) {
    if (row.item_id) {
      result.items.push({
        id: row.item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        price_cents: row.item_price_cents,
        qty: row.qty,
      });
    }
  }
  return result;
}

export async function updateStatus(id, status) {
  const { rows } = await pool.query(
    "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return rows[0] ?? null;
}

export async function markAsPaid(paymentIntentId) {
  const { rows } = await pool.query(
    "UPDATE orders SET status = 'paid', paid_at = NOW() WHERE stripe_payment_intent_id = $1 RETURNING *",
    [paymentIntentId]
  );
  return rows[0] ?? null;
}
