import pg, { Pool } from "pg";
import pgCamelCase from "pg-camelcase";
const _ = pgCamelCase.inject(pg);
const client: Pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS || "postgres",
  port: 5432,
});

export { client };
