import "dotenv/config";
import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const seeds = [
  "seed_products.sql",
  "seed_admin.sql",
];

(async () => {
  const client = await pool.connect();
  try {
    for (const file of seeds) {
      const sql = fs.readFileSync(path.join(__dirname, "seeds", file), "utf8");
      await client.query(sql);
      console.log(`✓ ${file}`);
    }
    console.log("All seeds complete.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
})();
