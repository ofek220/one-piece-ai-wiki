import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DBUSER,
  host: process.env.DBHOST,
  database: process.env.DBDATABASE,
  password: process.env.DBPASSWORD,
  port: Number(process.env.DBPORT),
});

pool
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB connection error:", err));

export default pool;
