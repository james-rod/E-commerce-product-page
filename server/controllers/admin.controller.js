import { getAllUsers } from "../services/admin.service.js";

export async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
