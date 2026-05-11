CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  brand        VARCHAR(255) NOT NULL,
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  price_cents  INTEGER NOT NULL,
  discount_pct INTEGER NOT NULL DEFAULT 0,
  stock        INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
