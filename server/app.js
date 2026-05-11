import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/orders.routes.js";
import productRoutes from "./routes/products.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import configRoutes from "./routes/config.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const allowedOrigin = process.env.CLIENT_URL || "*";
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  }),
);

// Webhook must be mounted before express.json() — Stripe needs the raw request body
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeRoutes);
app.use("/api/config", configRoutes);

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 4 params required — Express identifies error handlers by arity
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
