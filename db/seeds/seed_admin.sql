-- Password is: admin123
-- Hash generated with bcrypt, 10 salt rounds
INSERT INTO users (email, name, password_hash, role)
VALUES (
  'admin@ecommerce.com',
  'Admin',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
