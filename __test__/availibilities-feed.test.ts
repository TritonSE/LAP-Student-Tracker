import availibilityFeedHandler from "../pages/api/availibility-feed";
import { client } from "../lib/db";
import { CalendarEvent, ClassEvent, CreateClassEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import ColorHash from "color-hash";
import { DateTime } from "luxon";

const hash = new ColorHash();
const teacherColorHash = hash.hex('fname lname');
const availibilityTitle = 'fname lname is Available';

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE from event_Information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from availibilities");

  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_a', 'event_a', 'blue', 'Class', false)"
  );


  await client.query(
    "INSERT INTO users(id, email, role, first_name, last_name, phone_number, address) VALUES('user_a', 'emaila@gmail.com', 'Teacher', 'fname', 'lname', '#', 'addr')"
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
    text: "INSERT INTO availibilities (user_id, mon, tue, wed, thu, fri, sat, time_zone) VALUES ('user_a', $1, $2, null, $3, $4, $5, 'America/Los_Angeles')",
    values: [
      [["08:00", "15:00"]],
      [["06:00", "10:00"], ["12:00", "16:30"]],
      [["08:00", "15:00"]],
      [["06:00", "09:00"], ["10:30", "11:30"], ["11:45", "13:00"], ["13:30", "16:00"]],
      [["08:00", "10:30"]]
    ]
  }
  );


})

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availibilities")
  client.end();
})

describe('[GET] /api/availibilites-feed/', () => {
  test("Getting availibility for a period where the user is not available at all", async () => {
    const query = {
      start: '2022-02-23T00:00:00-08:00',
      end: '2022-02-23T23:59:00-08:00',
      userId: 'user_a'
    }
    const expectedBody: CalendarEvent[] = []

    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  });

  test("Getting availibility for a period where the user has a class completely within the availibility period", async () => {
    const query = {
      start: '2022-02-21T00:00:00-05:00',
      end: '2022-02-22T00:00:00-05:00',
      userId: 'user_a'
    }

    const expectedBody: CalendarEvent[] = [{
      id: 'user_a',
      title: availibilityTitle,
      backgroundColor: teacherColorHash,
      startStr: DateTime.fromObject({ year: 2022, month: 2, day: 21, hour: 8, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
      endStr: DateTime.fromObject({ year: 2022, month: 2, day: 21, hour: 11, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
    },
    {
      id: 'user_a',
      title: availibilityTitle,
      backgroundColor: teacherColorHash,
      startStr: DateTime.fromObject({ year: 2022, month: 2, day: 21, hour: 13, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
      endStr: DateTime.fromObject({ year: 2022, month: 2, day: 21, hour: 15, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
    }]

    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  })

  test("Get availibility for a period where no classes interfere", async () => {
    const query = {
      start: '2022-02-22T00:00:00-05:00',
      end: '2022-02-23T00:00:00-05:00',
      userId: 'user_a'
    }

    const expectedBody: CalendarEvent[] = [
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 22, hour: 6, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 22, hour: 10, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
      },
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 22, hour: 12, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 22, hour: 16, minute: 30 }).setZone('America/Los_Angeles').toLocal().toISO(),
      }
    ]


    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  });

  test('Getting availibilities when a class interferes for the beginning of the availible period', async () => {
    const query = {
      start: '2022-02-24T00:00:00-08:00',
      end: '2022-02-24T23:59:00-08:00',
      userId: 'user_a'
    }

    const expectedBody: CalendarEvent[] = [
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 24, hour: 9, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 24, hour: 15, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
      }
    ]


    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  });

  test("Getting availibilities when user has 2 classes in a day and multiple overlapping availibilities", async () => {
    const query = {
      start: '2022-02-25T00:00:00-08:00',
      end: '2022-02-25T23:59:00-08:00',
      userId: 'user_a'
    }

    const expectedBody: CalendarEvent[] = [
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 6, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 8, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
      },
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 10, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 11, minute: 30 }).setZone('America/Los_Angeles').toLocal().toISO(),
      },
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 11, minute: 45 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 12, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
      },
      {
        id: 'user_a',
        title: availibilityTitle,
        backgroundColor: teacherColorHash,
        startStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 14, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
        endStr: DateTime.fromObject({ year: 2022, month: 2, day: 25, hour: 16, minute: 0 }).setZone('America/Los_Angeles').toLocal().toISO(),
      },
    ]

    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  })

  test("Get availibility when a class overlaps completely with an availibility", async () => {
    const query = {
      start: '2022-02-26T00:00:00-08:00',
      end: '2022-02-26T23:59:00-08:00',
      userId: 'user_a'
    }

    const expectedBody: CalendarEvent[] = [];

    await makeHTTPRequest(availibilityFeedHandler, "/api/availibility-feed/", query, "GET", undefined, StatusCodes.OK, expectedBody)
  })
})