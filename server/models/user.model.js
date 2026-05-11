import pool from "../config/db.js";

export async function findByEmail(email) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return rows[0] ?? null;
}

export async function findById(id) {
  const { rows } = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
  return rows[0] ?? null;
}

export async function create({ email, name, password_hash, role = "customer" }) {
  const { rows } = await pool.query(
    `INSERT INTO users (email, name, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, name, password_hash, role]
  );
  return rows[0];
}
