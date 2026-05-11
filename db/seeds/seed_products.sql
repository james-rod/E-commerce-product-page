INSERT INTO products (brand, name, description, price_cents, discount_pct, stock, is_active)
VALUES (
  'Sneaker Company',
  'Fall Limited Edition Sneakers',
  'These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they''ll withstand everything the weather can offer.',
  12500,
  50,
  100,
  TRUE
);

INSERT INTO product_images (product_id, url, thumbnail_url, sort_order)
VALUES
  (1, '/images/image-product-1.jpg', '/images/image-product-1-thumbnail.jpg', 1),
  (1, '/images/image-product-2.jpg', '/images/image-product-2-thumbnail.jpg', 2),
  (1, '/images/image-product-3.jpg', '/images/image-product-3-thumbnail.jpg', 3),
  (1, '/images/image-product-4.jpg', '/images/image-product-4-thumbnail.jpg', 4);
