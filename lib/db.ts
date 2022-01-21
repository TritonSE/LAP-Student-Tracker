import { Pool } from "pg";
const client: Pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS,
  port: 5432,
});

export { client };
