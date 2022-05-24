// @ts-ignore
const { Pool } = require("pg");
const dotenv = require("dotenv")
const { migrate } = require("postgres-migrations");

let DB_PORT = undefined;
if (process.env.DB_PORT) {
  DB_PORT = Number(process.env.DB_PASS);
}
const client = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB || "postgres",
  password: process.env.DB_PASS || "postgres",
  port: DB_PORT || 5432,
});

const runMigration = async () => {
  try {
    await migrate({ client }, "./migrations");
    console.log("Migration Ran Successfully");
  } catch (e) {
    console.log(e);
  }
};

runMigration().then(() => process.exit());
