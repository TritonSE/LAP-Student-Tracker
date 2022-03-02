import { classHandler } from "../pages/api/class";
import { classIDHandler } from "../pages/api/class/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { UpdateClass, Class } from "../models/class";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const CLASS_NOT_FOUND_ERROR = "class not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from event_Information");
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('11', 'class1', 'blue', 'class', false)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('22', 'class2', 'green', 'class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('33', 'class2', 'green', 'class', true)"
  );
  await client.query("DELETE from classes");
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('11', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english')"
  );
});

afterAll(async () => {
  await client.query("DELETE from classes");
  await client.end();
});

describe("[POST] /api/class", () => {
  test("creates a new class", async () => {
    const body: Class = {
      eventInformationId: "33",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
    };
    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("doesn't create a duplicate class", async () => {
    const body: Class = {
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
    };

    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });

  test("body does not have a required field", async () => {
    const body = {
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      startTime: "07:34Z",
      endTime: "08:34Z",
    };
    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      FIELDS_NOT_ENTERED_CORRECTLY
    );
  });
});

describe("[GET] /api/class/[id]", () => {
  test("look for a class that exists", async () => {
    const expected: Class = {
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
    };

    const query = {
      id: "11",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("fails for a class that does not exist", async () => {
    const query = {
      id: "not_a_real_id",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/not_a_real_id",
      query,
      "GET",
      undefined,
      404,
      CLASS_NOT_FOUND_ERROR
    );
  });
});

describe("[PATCH] /api/class/[id]", () => {
  test("editing everything for a class that does exist", async () => {
    const expected: Class = {
      eventInformationId: "11",
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "Java",
    };

    const query = {
      id: "11",
    };

    const body: UpdateClass = {
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      language: "Java",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing few fields for a class that does exist", async () => {
    const expected: Class = {
      eventInformationId: "11",
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "Java",
    };

    const query = {
      id: "11",
    };

    const body: UpdateClass = {
      minLevel: 4,
      maxLevel: 6,
      language: "Java",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing a class that does not exist", async () => {
    const query = {
      id: "not_a_real_id",
    };

    const body: UpdateClass = {
      language: "Python",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/not_a_real_id",
      query,
      "PATCH",
      body,
      404,
      CLASS_NOT_FOUND_ERROR
    );
  });
});
