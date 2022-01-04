const { Pool } = require("pg");
const { migrate } = require("postgres-migrations");

const client = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS,
  port: 5432,
});

const runMigration = async () => {
  try {
    await migrate({ client }, "./migrations");
    console.log("Migration Ran Succesfully");
  } catch (e) {
    console.log(e);
  }
};

runMigration().then(() => process.exit());
