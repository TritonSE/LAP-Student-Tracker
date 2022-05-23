import availabilityFeedHandler from "../pages/api/availability-feed";
import { client } from "../lib/db";
import { CalendarEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";
import { getISOTimeFromExplicitFields, makeHTTPRequest } from "./__testutils__/testutils.test";
import ColorHash from "color-hash";

const hash = new ColorHash();
const teacherColorHash = hash.hex("fname lname");
const availabilityTitle = "fname lname is Available";

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE from event_Information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from availabilities");
  await client.query("DELETE from images");

  await client.query("INSERT into images (id) VALUES('1')");

  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_a', 'event_a', 'blue', 'Class', false)"
  );

  await client.query(
<<<<<<< HEAD
    "INSERT INTO users(id, email, role, approved, first_name, last_name, phone_number, address, date_created) VALUES('user_a', 'emaila@gmail.com', 'Teacher', false, 'fname', 'lname', '#', 'addr', '5/23/2022, 4:45:03 AM')"
=======
    "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address, picture_id) VALUES('user_a', 'emaila@gmail.com', 'Teacher', 'fname', 'lname', '#', 'addr', '1')"
>>>>>>> origin/master
  );
  await client.query(
    "INSERT INTO commitments(user_id, event_information_id) VALUES('user_a', 'id_a')"
  );

  // class on mon
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-21 11:45:00-08', '2022-02-21 13:45:00-08')"
  );
  // class on wednesday
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-23 11:45:00-08', '2022-02-23 13:45:00-08')"
  );
  // class on thurs
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-24 06:45:00-08', '2022-02-24 09:45:00-08')"
  );

  // 2 classes on friday
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-25 08:45:00-08', '2022-02-25 10:45:00-08')"
  );

  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-25 12:00:00-08', '2022-02-25 14:00:00-08')"
  );

  //class on saturday
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('id_a', '2022-02-26 08:00:00-08', '2022-02-26 10:30:00-08')"
  );

  await client.query({
    text: "INSERT INTO availabilities (user_id, mon, tue, wed, thu, fri, sat, time_zone) VALUES ('user_a', $1, $2, null, $3, $4, $5, 'America/Los_Angeles')",
    values: [
      [["08:00", "15:00"]],
      [
        ["06:00", "10:00"],
        ["12:00", "16:30"],
      ],
      [["08:00", "15:00"]],
      [
        ["06:00", "09:00"],
        ["10:30", "11:30"],
        ["11:45", "13:00"],
        ["13:30", "16:00"],
      ],
      [["08:00", "10:30"]],
    ],
  });
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availabilities");
  await client.end();
});

describe("[GET] /api/availability-feed/", () => {
  test("Getting availability for a period where the user is not available at all", async () => {
    const query = {
      start: "2022-02-23T00:00:00-08:00",
      end: "2022-02-24T00:00:00-08:00",
      userId: "user_a",
    };
    const expectedBody: CalendarEvent[] = [];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });

  test("Getting availability for a period where the user has a class completely within the availability period", async () => {
    const query = {
      start: "2022-02-21T00:00:00-05:00",
      end: "2022-02-22T00:00:00-05:00",
      userId: "user_a",
    };

    const expectedBody: CalendarEvent[] = [
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 21, 8, 0, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 21, 11, 45, "America/Los_Angeles"),
      },
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 21, 13, 45, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 21, 15, 0, "America/Los_Angeles"),
      },
    ];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });

  test("Get availability for a period where no classes interfere", async () => {
    const query = {
      start: "2022-02-22T00:00:00-05:00",
      end: "2022-02-23T00:00:00-05:00",
      userId: "user_a",
    };

    const expectedBody: CalendarEvent[] = [
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 22, 6, 0, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 22, 10, 0, "America/Los_Angeles"),
      },
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 22, 12, 0, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 22, 16, 30, "America/Los_Angeles"),
      },
    ];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });

  test("Getting availabilities when a class interferes for the beginning of the available period", async () => {
    const query = {
      start: "2022-02-24T00:00:00-08:00",
      end: "2022-02-24T23:59:00-08:00",
      userId: "user_a",
    };

    const expectedBody: CalendarEvent[] = [
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 24, 9, 45, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 24, 15, 0, "America/Los_Angeles"),
      },
    ];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });

  test("Getting availabilities when user has 2 classes in a day and multiple overlapping availabilities", async () => {
    const query = {
      start: "2022-02-25T00:00:00-08:00",
      end: "2022-02-25T23:59:00-08:00",
      userId: "user_a",
    };

    const expectedBody: CalendarEvent[] = [
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 25, 6, 0, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 25, 8, 45, "America/Los_Angeles"),
      },
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 25, 10, 45, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 25, 11, 30, "America/Los_Angeles"),
      },
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 25, 11, 45, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 25, 12, 0, "America/Los_Angeles"),
      },
      {
        id: "user_a",
        title: availabilityTitle,
        backgroundColor: teacherColorHash,
        start: getISOTimeFromExplicitFields(2022, 2, 25, 14, 0, "America/Los_Angeles"),
        end: getISOTimeFromExplicitFields(2022, 2, 25, 16, 0, "America/Los_Angeles"),
      },
    ];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });

  test("Get availability when a class overlaps completely with an availability", async () => {
    const query = {
      start: "2022-02-26T00:00:00-08:00",
      end: "2022-02-27T00:00:00-08:00",
      userId: "user_a",
    };

    const expectedBody: CalendarEvent[] = [];

    await makeHTTPRequest(
      availabilityFeedHandler,
      "/api/availability-feed/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expectedBody
    );
  });
});
