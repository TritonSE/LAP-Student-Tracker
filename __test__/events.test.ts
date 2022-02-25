import { eventHandler } from "../pages/api/events/class";
import { client } from "../lib/db";
import { makeHTTPRequest, makeEventHTTPRequest } from "./__testutils__/testutils.test";
import { CreateClassEvent, ClassEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const TEACHERS_DO_NOT_EXIST = "The given teachers do not exist";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890')"
  );
});

afterAll(async () => {
  await client.end();
});

describe("[POST] /api/events/class", () => {
  it("creates a new class event", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "2022-02-27T05:11:45.000Z",
      endTime: "2022-02-27T05:11:45.000Z",
      timeZone: "utc",
      rrule: "FREQ=WEEKLY;BYDAY=SU,MO;INTERVAL=1;UNTIL=20220424",
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"] 
    };
    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: "2022-02-27T05:11:45.000Z",
      endTime: "2022-02-27T05:11:45.000Z",
      timeZone: "utc",
      rrule: "FREQ=WEEKLY;BYDAY=SU,MO;INTERVAL=1;UNTIL=20220424",
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
    };
    await makeEventHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      expectedBody
    );
  });
});