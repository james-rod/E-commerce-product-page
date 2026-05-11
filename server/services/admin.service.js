import pool from "../config/db.js";

export async function getAllUsers() {
  const { rows } = await pool.query(
    "SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC"
  );
  return rows;
}
