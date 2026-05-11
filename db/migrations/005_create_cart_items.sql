CREATE TABLE IF NOT EXISTS cart_items (
  id         SERIAL PRIMARY KEY,
  cart_id    INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  qty        INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT qty_positive CHECK (qty > 0),
  CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);
