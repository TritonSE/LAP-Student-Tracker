import eventHandler from "../pages/api/events/class";
import { client } from "../lib/db";
import { makeEventHTTPRequest, makeEventErrorHTTPRequest } from "./__testutils__/testutils.test";
import { CreateClassEvent, ClassEvent } from "../models/events";
import { StatusCodes } from "http-status-codes";
import RRule, { rrulestr } from "rrule";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

const currDate = new Date();
const rule = new RRule({
  freq: 2,
  interval: 1,
  byweekday: [RRule.MO, RRule.FR],
  until: new Date(currDate.getFullYear() + 1, currDate.getMonth(), currDate.getDay())
});

const ruleStr = rule.toString();

beforeAll(async () => {
  await client.query("DELETE from commitments");
  await client.query("DELETE from calender_information");
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
});

afterAll(async () => {
  await client.query("DELETE from commitments");
  await client.query("DELETE from calender_information");
  await client.query("DELETE from event_information");
  await client.query("DELETE from users");
  await client.end();
});

describe("[POST] /api/events/class", () => {
  it("creates a new class event", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: ruleStr,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: "11:45:00.000-08:00",
      endTime: "11:45:00.000-08:00",
      timeZone: "America/Los_Angeles",
      rrule: ruleStr,
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

  it("creates a new class event with different timezone", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/New_York",
      rrule: ruleStr,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: "11:45:00.000-05:00",
      endTime: "11:45:00.000-05:00",
      timeZone: "America/New_York",
      rrule: ruleStr,
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

  it("creates a new class event with non-existing teacher", async () => {
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "11:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: ruleStr,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["random123@gmail.com"],
    };

    await makeEventErrorHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });

  it("creates a new class event with bad parameters", async () => {
    const body = {
      name: "Math 101",
      startTime: "12:45",
      endTime: 1145,
      timeZone: "America/Los_Angeles",
      rrule: ruleStr,
      language: "english",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
    };

    await makeEventErrorHTTPRequest(
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
