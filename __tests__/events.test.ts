import eventHandler from "../pages/api/events/class";
import { client } from "../lib/db";
import {
  convertTimeToISO,
  makeEventHTTPRequest,
  makeHTTPRequest,
} from "./__testutils__/testutils.test";
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
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_1', 'Event', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-01 10:00:00-0', '2022-01-01 11:00:00-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-03 10:00:00-08', '2022-01-03 11:00:00-08')"
  );
  await client.query(
    "INSERT INTO calendar_information(event_information_id, start_str, end_str) VALUES('e_1', '2022-01-05 10:00:00-08', '2022-01-05 11:00:00-08')"
  );
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('2', 'e_1')");

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
  // test("creates a new class event", async () => {
  //   const body: CreateClassEvent = {
  //     name: "Math 101",
  //     startTime: "11:45",
  //     endTime: "11:45",
  //     timeZone: "America/Los_Angeles",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //     teachers: ["teacher@gmail.com"],
  //   };

  //   const expectedBody: ClassEvent = {
  //     eventInformationId: "",
  //     startTime: convertTimeToISO("11:45", "America/Los_Angeles"),
  //     endTime: convertTimeToISO("11:45", "America/Los_Angeles"),
  //     timeZone: "America/Los_Angeles",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //   };

  //   await makeEventHTTPRequest(
  //     eventHandler,
  //     "/api/events/class",
  //     undefined,
  //     "POST",
  //     body,
  //     StatusCodes.CREATED,
  //     expectedBody
  //   );
  // });

  // test("creates a new class event with different timezone", async () => {
  //   const body: CreateClassEvent = {
  //     name: "Math 101",
  //     startTime: "11:45",
  //     endTime: "11:45",
  //     timeZone: "America/New_York",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //     teachers: ["teacher@gmail.com"],
  //   };

  //   const expectedBody: ClassEvent = {
  //     eventInformationId: "",
  //     startTime: convertTimeToISO("11:45", "America/New_York"),
  //     endTime: convertTimeToISO("11:45", "America/New_York"),
  //     timeZone: "America/New_York",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //   };

  //   await makeEventHTTPRequest(
  //     eventHandler,
  //     "/api/events/class",
  //     undefined,
  //     "POST",
  //     body,
  //     StatusCodes.CREATED,
  //     expectedBody
  //   );
  // });

  // test("creates a new class event with non-existing teacher", async () => {
  //   const body: CreateClassEvent = {
  //     name: "Math 101",
  //     startTime: "11:45",
  //     endTime: "11:45",
  //     timeZone: "America/Los_Angeles",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //     teachers: ["random123@gmail.com"],
  //   };

  //   await makeHTTPRequest(
  //     eventHandler,
  //     "/api/events/class",
  //     undefined,
  //     "POST",
  //     body,
  //     StatusCodes.BAD_REQUEST,
  //     "The following teachers { random123@gmail.com } do not exist"
  //   );
  // });

  // test("creates a new class event with bad parameters", async () => {
  //   const body = {
  //     name: "Math 101",
  //     startTime: "12:45",
  //     endTime: 1145,
  //     timeZone: "America/Los_Angeles",
  //     rrule: rule,
  //     language: "english",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //     teachers: ["teacher@gmail.com"],
  //   };

  //   await makeHTTPRequest(
  //     eventHandler,
  //     "/api/events/class",
  //     undefined,
  //     "POST",
  //     body,
  //     StatusCodes.BAD_REQUEST,
  //     FIELDS_NOT_ENTERED_CORRECTLY
  //   );
  // });

  // test("creates a new class event that passes teacher verification", async () => {
  //   const rrule = new RRule({
  //     freq: RRule.DAILY,
  //     interval: 2,
  //     count: 3,
  //     dtstart: new Date(2022, 0, 2),
  //   });
  //   const body = {
  //     name: "Math 101",
  //     startTime: "10:45",
  //     endTime: "11:45",
  //     timeZone: "America/New_York",
  //     rrule: rrule.toString(),
  //     language: "Java",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //     teachers: ["teacher@gmail.com"],
  //   };

  //   const expectedBody: ClassEvent = {
  //     eventInformationId: "",
  //     startTime: convertTimeToISO("10:45", "America/New_York"),
  //     endTime: convertTimeToISO("11:45", "America/New_York"),
  //     timeZone: "America/New_York",
  //     rrule: rrule.toString(),
  //     language: "Java",
  //     neverEnding: false,
  //     backgroundColor: "blue",
  //   };

  //   await makeEventHTTPRequest(
  //     eventHandler,
  //     "/api/events/class",
  //     undefined,
  //     "POST",
  //     body,
  //     StatusCodes.CREATED,
  //     expectedBody
  //   );
  // });

  test("creates a new class event that fails teacher verification", async () => {
    const rrule = new RRule({
      freq: RRule.DAILY,
      interval: 2,
      count: 3,
      dtstart: new Date(2022, 0, 1),
    });
    const body = {
      name: "Math 101",
      startTime: "10:45",
      endTime: "11:45",
      timeZone: "America/Los_Angeles",
      rrule: rrule.toString(),
      language: "Java",
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
      "Teacher 2 has conflict with class"
    );

    // body.rrule = new RRule({
    //   freq: RRule.DAILY,
    //   interval: 2,
    //   count: 3,
    //   dtstart: new Date(2022, 0, 5),
    // }).toString();

    // await makeHTTPRequest(
    //   eventHandler,
    //   "/api/events/class",
    //   undefined,
    //   "POST",
    //   body,
    //   StatusCodes.BAD_REQUEST,
    //   "Teacher 2 has conflict with class"
    // );
  });
});
