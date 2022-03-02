import eventFeedHandler from "../pages/api/event-feed";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { CalendarEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calender_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_a', 'event_a', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_b', 'event_b', 'red', 'Class', false)"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_c', 'event_c', 'green', 'Class', false)"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-26 21:11:45-08', '2022-02-26 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-27 21:11:45-08', '2022-02-27 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_b', '2022-02-24 21:11:45-08', '2022-02-24 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_b', '2022-02-26 21:11:45-08', '2022-02-26 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_c', '2022-02-23 21:11:45-08', '2022-02-23 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calender_information(event_information_id, start_str, end_str) VALUES('id_c', '2022-03-01 21:11:45-08', '2022-03-01 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address) VALUES('user_a', 'emaila@gmail.com', 'role', 'fname', 'lname', '#', 'addr')"
  );
  await client.query(
    "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address) VALUES('user_b', 'emailb@gmail.com', 'role', 'fname', 'lname', '#', 'addr')"
  );
  await client.query(
    "INSERT INTO commitments(user_id, event_information_id) VALUES('user_a', 'id_a')"
  );
  await client.query(
    "INSERT INTO commitments(user_id, event_information_id) VALUES('user_b', 'id_b')"
  );
});

afterAll(async () => {
  await client.end();
});

describe("[GET] /api/event-feed", () => {
  test("get calendar event feed", async () => {
    const body = {
      start: "2022-02-25 21:11:45-08",
      end: "2022-02-28 21:11:45-08",
      userId: "user_a",
    };
    const expected: CalendarEvent[] = [
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        startStr: "2022-02-26 21:11:45-08",
        endStr: "2022-02-26 21:11:45-08",
      },
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        startStr: "2022-02-27 21:11:45-08",
        endStr: "2022-02-27 21:11:45-08",
      },
    ];
    await makeHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      body,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

/*describe("[GET] /api/staff with no staff", () => {
  beforeAll(async () => {
    await client.query("DELETE from users WHERE role = 'Teacher' OR role = 'Admin'");
  });

  test("Works correctly with 0 users", async () => {
    await makeHTTPRequest(
      staffHandler,
      "/api/users/",
      undefined,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      []
    );
  });
});*/
