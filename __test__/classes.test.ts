import { classHandler } from "../pages/api/class";
import { classIDHandler } from "../pages/api/class/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { UpdateClass, Class } from "../models/class";
import { StatusCodes } from "http-status-codes";
import { max } from "moment";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const CLASS_NOT_FOUND_ERROR = "class not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from class");
  await client.query(
    "INSERT INTO class(id, name, minLevel, maxLevel, rrstring, timeStart, timeEnd) VALUES('1', 'Intro to Java', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z')"
  );
 /* await client.query(
    "INSERT INTO classes(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890')"
  );
  await client.query(
    "INSERT INTO classes(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890')"
  );*/
});

afterAll(async () => {
  await client.query("DELETE from class");
  await client.end();
});

describe("[POST] /api/class", () => {
  test("creates a new class", async () => {
    const body: Class = {
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
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
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
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
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
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
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
    };

    const query = {
      id: "1",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/1",
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
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
    };

    const query = {
      id: "1",
    };

    const body: UpdateClass = {
        name: "Advanced Java",
        minLevel: 4,
        maxLevel: 6,
        rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/1",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing few fields for a class that does exist", async () => {
    const expected: Class = {
        id: "1",
        name: "Intro to Java",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        timeStart: "07:34Z",
        timeEnd: "08:34Z",
    };

    const query = {
      id: "1",
    };

    const body: UpdateClass = {
      minLevel: 4,
      maxLevel: 6,
      name: "Advanced Java"
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/1",
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
      name: "Not a real Class",
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
