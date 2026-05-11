import "dotenv/config";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const migrations = [
  "001_create_users.sql",
  "002_create_products.sql",
  "003_create_product_images.sql",
  "004_create_carts.sql",
  "005_create_cart_items.sql",
  "006_create_orders.sql",
  "007_add_stripe_to_orders.sql",
];

(async () => {
  const client = await pool.connect();
  try {
    for (const file of migrations) {
      const sql = fs.readFileSync(path.join(__dirname, "migrations", file), "utf8");
      await client.query(sql);
      console.log(`✓ ${file}`);
    }
    console.log("All migrations complete.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
