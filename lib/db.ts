import pg, { Pool } from "pg";
import pgCamelCase from "pg-camelcase";

pgCamelCase.inject(pg);
let DB_PORT: number | undefined = undefined;
if (process.env.DB_PORT) {
  DB_PORT = Number(process.env.DB_PASS);
}

const config =
  process.env.NODE_ENV == "production"
    ? {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB || "postgres",
        password: process.env.DB_PASS || "postgres",
        port: DB_PORT || 5432,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB || "postgres",
        password: process.env.DB_PASS || "postgres",
        port: DB_PORT || 5432,
      };

const client: Pool = new Pool(config);

export { client };
