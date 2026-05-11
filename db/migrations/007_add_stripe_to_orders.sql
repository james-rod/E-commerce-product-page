ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS stripe_client_secret      VARCHAR(500),
  ADD COLUMN IF NOT EXISTS paid_at                   TIMESTAMPTZ;
