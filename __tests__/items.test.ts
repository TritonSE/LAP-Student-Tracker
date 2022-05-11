// TODO

import classModulesHandler from "../pages/api/class/[id]/modules";
import moduleHandler from "../pages/api/module/[id]";
import createModuleHandler from "../pages/api/module";
import { client } from "../lib/db";
import { makeHTTPRequest, makeUserHTTPRequest } from "./__testutils__/testutils.test";
import { Module, CreateModule, UpdateModule } from "../models/modules";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "user not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
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
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_1', 'e_1', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_2', 'e_1', 'Week 1', 0)"
  );  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_3', 'e_1', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_4', 'e_2', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_5', 'e_2', 'Week 1', 0)"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
  await client.end();
});
describe("[GET] /api/users/[id]", () => {
  test("look for a user that exists", async () => {
    expect(true)
    /*const expected: User = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };

    const query = {
      id: 1,
    };

    await makeUserHTTPRequest(
      userIDHandler,
      "/api/users/1",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );*/
  });
});