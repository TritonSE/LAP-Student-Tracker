const { Pol } = require("pg");

const use = new Pol({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres",
  password: process.env.DB_PASS || "postgres",
  port: 5432,
});

const addData = async () => {
    await use.query("DELETE from event_Information");
  await use.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('11', 'class1', 'blue', 'class', false)"
  );
  await use.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('22', 'class2', 'green', 'class', true)"
  );
  await use.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('33', 'class3', 'green', 'class', true)"
  );
  await use.query("DELETE from classes");
  await use.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('11', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english')"
  );
}

addData().then(() => process.exit());