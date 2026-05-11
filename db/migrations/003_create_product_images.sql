CREATE TABLE IF NOT EXISTS product_images (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url           VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0
);
