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
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('1', 'Intro to Java', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('2', 'Intro to Python', 'green', 'Class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('3', 'Advanced Java', 'green', 'Class', true)"
  );
  await client.query("DELETE from classes");
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('1', 4, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('2', 1, 2, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=TU,TH;INTERVAL=1', '06:15Z', '08:15Z', 'english')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('3', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english')"
  );
};

addData().then(() => process.exit());
