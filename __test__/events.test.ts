import eventHandler from "../pages/api/events/class";
import { client } from "../lib/db";
import { convertTimeToISO, makeEventHTTPRequest, makeHTTPRequest } from "./__testutils__/testutils.test";
import { CreateClassEvent, ClassEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";
import RRule from "rrule";

const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

let rule: string;

beforeAll(async () => {
  await client.query("DELETE from commitments");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from event_information");
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

  const currDate = new Date();
  const ruleObj = new RRule({
    freq: 2,
    interval: 1,
    byweekday: [RRule.MO, RRule.FR],
    until: new Date(currDate.getFullYear() + 1, currDate.getMonth(), currDate.getDay()),
  });
  rule = ruleObj.toString();
});

afterAll(async () => {
  await client.query("DELETE from commitments");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from event_information");
  await client.query("DELETE from users");
  await client.end();
});

describe("[POST] /api/events/class", () => {
  test("creates a new class event", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: rule,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: convertTimeToISO("11:45", "America/Los_Angeles"),
      endTime: convertTimeToISO("11:45", "America/Los_Angeles"),
      timeZone: "America/Los_Angeles",
      rrule: rule,
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

  test("creates a new class event with different timezone", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/New_York",
      rrule: rule,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: convertTimeToISO("11:45", "America/New_York"),
      endTime: convertTimeToISO("11:45", "America/New_York"),
      timeZone: "America/New_York",
      rrule: rule,
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

  test("creates a new class event with non-existing teacher", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: rule,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["random123@gmail.com"],
    };

    await makeHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      "The following teachers { random123@gmail.com } do not exist"
    );
  });

  test("creates a new class event with bad parameters", async () => {
    const body = {
      name: "Math 101",
      startTime: "12:45",
      endTime: 1145,
      timeZone: "America/Los_Angeles",
      rrule: rule,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    await makeHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      FIELDS_NOT_ENTERED_CORRECTLY
    );
  });
});
