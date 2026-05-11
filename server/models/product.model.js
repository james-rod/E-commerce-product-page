import pool from "../config/db.js";

const WITH_IMAGES = `
  SELECT
    p.*,
    pi.id          AS img_id,
    pi.url         AS img_url,
    pi.thumbnail_url,
    pi.sort_order
  FROM products p
  LEFT JOIN product_images pi ON pi.product_id = p.id
`;

function groupImages(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.id)) {
      const { img_id, img_url, thumbnail_url, sort_order, ...product } = row;
      map.set(row.id, { ...product, images: [] });
    }
    if (row.img_id) {
      map.get(row.id).images.push({
        id: row.img_id,
        url: row.img_url,
        thumbnail_url: row.thumbnail_url,
        sort_order: row.sort_order,
      });
    }
  }
  return [...map.values()];
}

export async function findAll() {
  const { rows } = await pool.query(
    `${WITH_IMAGES} WHERE p.is_active = TRUE ORDER BY p.id, pi.sort_order`
  );
  return groupImages(rows);
}

export async function findById(id) {
  const { rows } = await pool.query(
    `${WITH_IMAGES} WHERE p.id = $1 ORDER BY pi.sort_order`,
    [id]
  );
  const results = groupImages(rows);
  return results[0] ?? null;
}

export async function create({ brand, name, description, price_cents, discount_pct = 0, stock = 0 }) {
  const { rows } = await pool.query(
    `INSERT INTO products (brand, name, description, price_cents, discount_pct, stock)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [brand, name, description, price_cents, discount_pct, stock]
  );
  return rows[0];
}

export async function update(id, { brand, name, description, price_cents, discount_pct, stock }) {
  const { rows } = await pool.query(
    `UPDATE products
     SET brand = COALESCE($1, brand),
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         price_cents = COALESCE($4, price_cents),
         discount_pct = COALESCE($5, discount_pct),
         stock = COALESCE($6, stock)
     WHERE id = $7
     RETURNING *`,
    [brand, name, description, price_cents, discount_pct, stock, id]
  );
  return rows[0] ?? null;
}

export async function deactivate(id) {
  const { rows } = await pool.query(
    "UPDATE products SET is_active = FALSE WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0] ?? null;
}
