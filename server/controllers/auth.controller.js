import { register, login } from "../services/auth.service.js";

export async function registerController(req, res) {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: "Email, name, and password are required" });
  }

  try {
    const result = await register({ email, name, password });
    res.status(201).json(result);
  } catch (err) {
    const status = err.message === "Email already in use" ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await login({ email, password });
    res.status(200).json(result);
  } catch (err) {
    const status = err.message === "Invalid credentials" ? 401 : 500;
    res.status(status).json({ error: err.message });
  }
}
