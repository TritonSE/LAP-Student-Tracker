import announcementHandler from "../pages/api/class/[id]/announcement";
import announcementIdHandler from "../pages/api/class/[id]/announcement/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { CreateAnnouncement, Announcement } from "../models";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from announcements");
  await client.query("DELETE from users");
  await client.query("DELETE from images");
  await client.query("INSERT INTO images(id) VALUES ('1')");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id, date_created) VALUES('44', 'Bill', 'Test', 'bt@gmail.com', 'Teacher', '14 nowhere lane', '123-456-7892', '1', 'today')"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_1', 'CSE 8A', 'blue', 'Class', 'false')"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_2', 'CSE 11', 'red', 'Class', 'false')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('e_1', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'Python')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('e_2', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'Java')"
  );
  await client.query(
    "INSERT INTO announcements(event_information_id, title, content, id) VALUES('e_1', 'Title 1', 'Content 1', 'a_1')"
  );
  await client.query(
    "INSERT INTO announcements(event_information_id, title, content, id) VALUES('e_2', 'Title 2', 'Content 2', 'a_2')"
  );
  await client.query(
    "INSERT INTO announcements(event_information_id, title, content, id) VALUES('e_2', 'Title 3', 'Content 3', 'a_3')"
  );
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('44', 'e_1')");
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('44', 'e_2')");
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from announcements");
  await client.end();
});

describe("[GET] /api/class/[id]/announcements", () => {
  test("get all announcements for a class", async () => {
    const expected: Announcement[] = [
      {
        eventInformationId: "e_1",
        title: "Title 1",
        content: "Content 1",
        id: "a_1",
      },
    ];

    const query = {
      id: "e_1",
    };

    await makeHTTPRequest(
      announcementHandler,
      "/api/class/e_1/announcement",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get all announcements for another class", async () => {
    const expected: Announcement[] = [
      {
        eventInformationId: "e_2",
        title: "Title 2",
        content: "Content 2",
        id: "a_2",
      },
      {
        eventInformationId: "e_2",
        title: "Title 3",
        content: "Content 3",
        id: "a_3",
      },
    ];

    const query = {
      id: "e_2",
    };

    await makeHTTPRequest(
      announcementHandler,
      "/api/class/e_2/announcement",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

describe("[POST] /api/class/[id]/announcement", () => {
  test("create a class announcement", async () => {
    const expected: CreateAnnouncement = {
      title: "Title 4",
      content: "Content 4",
    };

    const query = {
      id: "e_1",
    };

    await makeHTTPRequest(
      announcementHandler,
      "/api/class/e_1/announcement",
      query,
      "POST",
      expected,
      StatusCodes.CREATED,
      []
    );
  });
});

describe("[DELETE] /api/class/[id]/announcement/[id]", () => {
  test("create a class announcement", async () => {
    const query = {
      class_id: "e_2",
      id: "a_3",
    };

    await makeHTTPRequest(
      announcementIdHandler,
      "/api/class/e_2/announcement/a_3",
      query,
      "DELETE",
      undefined,
      StatusCodes.ACCEPTED,
      []
    );
  });
});
