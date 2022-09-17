import eventHandler from "../pages/api/events/class";
import { client } from "../lib/db";
import {
  convertTimeToISO,
  makeEventHTTPRequest,
  makeHTTPRequest,
} from "./__testutils__/testutils.test";
import { ClassEvent, CreateClassEvent } from "../models";
import { StatusCodes } from "http-status-codes";
import RRule from "rrule";

const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

let rule: string;

beforeAll(async () => {
  await client.query("DELETE from commitments");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from event_information");
  await client.query("DELETE from users");
  await client.query("DELETE from availabilities");
  await client.query("DELETE from images");

  await client.query("INSERT into images (id) VALUES('1')");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('2', 'Jane', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('4', 'Gary', 'Gillespie', 'gary@gmail.com', 'Teacher', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('5', 'Rick', 'Ord', 'ricko@gmail.com', 'Teacher', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('6', 'Miles', 'Jones', 'miles@gmail.com', 'Teacher', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_1', 'Java Bear', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-01 10:00:00-08', '2022-01-01 11:00:00-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-03 10:00:00-08', '2022-01-03 11:00:00-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-05 10:00:00-08', '2022-01-05 11:00:00-08')"
  );
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('2', 'e_1')");
  await client.query(
    "INSERT INTO availabilities (user_id, mon, wed, fri, time_zone) VALUES ('4', ARRAY[['10:00', '12:00']], ARRAY[['10:00', '12:00']], ARRAY[['10:00', '12:00']], 'America/Los_Angeles')"
  );
  await client.query(
    "INSERT INTO availabilities (user_id, mon, wed, fri, time_zone) VALUES ('6', ARRAY[['10:00', '12:00']], ARRAY[['10:00', '12:00']], ARRAY[['11:00', '12:00']], 'America/Los_Angeles')"
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
  await client.query("DELETE from availabilities");
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
      checkAvailabilities: false,
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
      checkAvailabilities: false,
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
      checkAvailabilities: false,
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
      checkAvailabilities: false,
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

  test("creates a new class event that passes teacher verification", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 2),
    });
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "10:45",
      endTime: "11:45",
      timeZone: "America/New_York",
      rrule: rrule.toString(),
      language: "Java",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
      checkAvailabilities: false,
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: convertTimeToISO("10:45", "America/New_York"),
      endTime: convertTimeToISO("11:45", "America/New_York"),
      timeZone: "America/New_York",
      rrule: rrule.toString(),
      language: "Java",
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

  test("creates a new class event that fails teacher verification", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 1),
    });
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "10:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["teacher@gmail.com"],
      checkAvailabilities: false,
    };

    await makeHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      "Teacher Jane Doe has conflict with class Java Bear"
    );
  });

  test("creates a new class event that passes availability check", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 3),
    });
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "10:00",
      endTime: "12:00",
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["gary@gmail.com"],
      checkAvailabilities: true,
    };

    const expectedBody: ClassEvent = {
      eventInformationId: "",
      startTime: convertTimeToISO("10:00", "America/Los_Angeles"),
      endTime: convertTimeToISO("12:00", "America/Los_Angeles"),
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
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

  test("create a new class event for teacher with no availabilities", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 3),
    });
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "10:00",
      endTime: "12:00",
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["ricko@gmail.com"],
      checkAvailabilities: true,
    };

    await makeHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      "Teacher Rick Ord is not available for class Math 101"
    );
  });

  test("create a new class event for teacher with some conflicting availabilities", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 3),
    });
    const body: CreateClassEvent = {
      name: "Math 101",
      startTime: "10:00",
      endTime: "12:00",
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
      neverEnding: false,
      backgroundColor: "blue",
      teachers: ["miles@gmail.com"],
      checkAvailabilities: true,
    };

    await makeHTTPRequest(
      eventHandler,
      "/api/events/class",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      "Teacher Miles Jones is not available for class Math 101"
    );
  });
});
