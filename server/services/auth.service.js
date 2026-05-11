import { hashPassword, verifyPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { findByEmail, create } from "../models/user.model.js";

export async function register({ email, name, password }) {
  const existing = await findByEmail(email);
  if (existing) throw new Error("Email already in use");

  const password_hash = await hashPassword(password);
  const user = await create({ email, name, password_hash });
  const token = signToken({ id: user.id, role: user.role });

  return { token, user: sanitize(user) };
}

export async function login({ email, password }) {
  const user = await findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) throw new Error("Invalid credentials");

  const token = signToken({ id: user.id, role: user.role });
  return { token, user: sanitize(user) };
}

function sanitize(user) {
  const { password_hash, ...safe } = user;
  return safe;
}
