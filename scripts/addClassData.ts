const { Pool } = require("pg");

const client = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS || "postgres",
  port: 5432,
});

const addData = async () => {
  await client.query("DELETE from event_Information");

  await client.query("DELETE from classes");
};

addData().then(() => process.exit());
