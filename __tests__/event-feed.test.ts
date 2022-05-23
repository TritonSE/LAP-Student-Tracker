import eventFeedHandler from "../pages/api/event-feed";
import { client } from "../lib/db";
import { makeEventFeedHTTPRequest, makeHTTPRequest } from "./__testutils__/testutils.test";
import { CalendarEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";

const MISSING_PARAMS_ERROR = "No start or end date specified";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
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
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-26 21:00:00-08', '2022-02-26 21:00:00-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-27 21:11:45-08', '2022-02-27 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_b', '2022-02-24 21:11:45-08', '2022-02-24 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_b', '2022-02-26 21:11:45-08', '2022-02-26 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_c', '2022-02-23 21:11:45-08', '2022-02-23 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_c', '2022-03-01 21:11:45-08', '2022-03-01 21:11:45-08')"
  );
  await client.query(
    "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address, date_created) VALUES('user_a', 'emaila@gmail.com', 'role', 'fname', 'lname', '#', 'addr', '5/23/2022, 4:45:03 AM')"
  );
  await client.query(
    "INSERT INTO commitments(user_id, event_information_id) VALUES('user_a', 'id_a')"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.end();
});

describe("[GET] /api/event-feed", () => {
  test("get calendar event feed for a user", async () => {
    const queryParams = {
      start: "2022-02-25 21:11:45-08",
      end: "2022-02-28 21:11:45-08",
      userId: "user_a",
    };
    const expected: CalendarEvent[] = [
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        start: "2022-02-26 21:00:00-08",
        end: "2022-02-26 21:00:00-08",
      },
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        start: "2022-02-27 21:11:45-08",
        end: "2022-02-27 21:11:45-08",
      },
    ];
    await makeEventFeedHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      queryParams,
      StatusCodes.OK,
      expected
    );
  });
  test("get calendar event feed without specifying user", async () => {
    const queryParams = {
      start: "2022-02-25 21:11:45-08",
      end: "2022-02-28 21:11:45-08",
      userId: undefined,
    };
    const expected: CalendarEvent[] = [
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        start: "2022-02-26 21:00:00-08",
        end: "2022-02-26 21:00:00-08",
      },
      {
        id: "id_a",
        title: "event_a",
        backgroundColor: "blue",
        start: "2022-02-27 21:11:45-08",
        end: "2022-02-27 21:11:45-08",
      },
      {
        id: "id_b",
        title: "event_b",
        backgroundColor: "red",
        start: "2022-02-26 21:11:45-08",
        end: "2022-02-26 21:11:45-08",
      },
    ];
    await makeEventFeedHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      queryParams,
      StatusCodes.OK,
      expected
    );
  });
  test("get calendar event feed with start > end", async () => {
    const queryParams = {
      start: "2022-02-28 21:11:45-08",
      end: "2022-02-25 21:11:45-08",
      userId: "user_a",
    };
    const expected: CalendarEvent[] = [];
    await makeEventFeedHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      queryParams,
      StatusCodes.OK,
      expected
    );
  });
  test("get calendar event feed for nonexistent user", async () => {
    const queryParams = {
      start: "2022-02-25 21:11:45-08",
      end: "2022-02-28 21:11:45-08",
      userId: "nonexistent",
    };
    const expected: CalendarEvent[] = [];
    await makeEventFeedHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      queryParams,
      StatusCodes.OK,
      expected
    );
  });
  test("get calendar event feed with missing parameters", async () => {
    // invoke original HTTP request handler on error case for event feed API
    await makeHTTPRequest(
      eventFeedHandler,
      "/api/event-feed/",
      undefined,
      "GET",
      undefined,
      StatusCodes.BAD_REQUEST,
      MISSING_PARAMS_ERROR
    );
  });
});
