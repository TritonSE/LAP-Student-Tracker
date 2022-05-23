import pg, { Pool } from "pg";
import pgCamelCase from "pg-camelcase";

pgCamelCase.inject(pg);
let DB_PASS: number | undefined = undefined;
if (process.env.DB_PASS) {
  DB_PASS = Number(process.env.DB_PASS);
}
const client: Pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS || "postgres",
  port: DB_PASS || 5432,
});

export { client };
