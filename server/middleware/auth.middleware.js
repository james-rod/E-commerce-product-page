import { verifyToken } from "../utils/jwt.js";
import { findById } from "../models/user.model.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  try {
    const token = header.slice(7);
    const payload = verifyToken(token);
    const user = await findById(payload.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
