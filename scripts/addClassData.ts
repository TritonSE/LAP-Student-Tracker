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
  await client.query("DELETE from users");
  await client.query("DELETE from commitments");
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('1', 'One', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('2', 'Two', 'green', 'Class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('3', 'Three', 'green', 'Class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('4', 'Four', 'green', 'Class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('5', 'Five', 'green', 'Class', true)"
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
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('4', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('5', 2, 4, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE;INTERVAL=1', '02:10Z', '03:10Z', 'english')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('77', 'John', 'Test', 'john@gmail.com', 'Teacher', '123 nowhere lane', '123-456-7890')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('88', 'Zain', 'Khan', 'zk@gmail.com', 'Teacher', '13 nowhere lane', '123-456-7891')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('99', 'Bill', 'Test', 'bt@gmail.com', 'Teacher', '14 nowhere lane', '123-456-7892')"
  );
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('77', '5')");
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('88', '4')");
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('99', '5')");
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('77', '4')");
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('77', '1')");
};

addData().then(() => process.exit());
