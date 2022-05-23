import staffHandler from "../pages/api/staff";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { Staff } from "../models/staff";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE from event_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from classes");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, approved, address, phone_number, date_created) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', false, '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, approved, address, phone_number, date_created) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', false, '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM')"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('1', 'Test Event', 'blue', 'class', 'false')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('1', '3', '5', 'RR', '2020-01-01', '2020-01-01', 'english')"
  );
  await client.query("INSERT INTO commitments(user_id, event_information_id) VALUES('2', '1')");
});

afterAll(async () => {
  await client.query("DELETE from users");
  await client.end();
});

describe("[GET] /api/staff", () => {
  test("look for all staff", async () => {
    const expected: Staff[] = [
      {
        id: "2",
        firstName: "Teacher",
        lastName: "Doe",
        email: "teacher@gmail.com",
        role: "Teacher",
        approved: false,
        dateCreated: '5/23/2022, 4:45:03 AM',
        address: "123 Main Street",
        phoneNumber: "1234567890",
        minLevel: 3,
        maxLevel: 5,
        language: "english",
      },
      {
        id: "3",
        firstName: "Admin",
        lastName: "Doe",
        email: "admin@gmail.com",
        role: "Admin",
        approved: false,
        dateCreated: '5/23/2022, 4:45:03 AM',
        address: "123 Main Street",
        phoneNumber: "1234567890",
        minLevel: null,
        maxLevel: null,
        language: null,
      },
    ];
    await makeHTTPRequest(
      staffHandler,
      "/api/staff",
      undefined,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

describe("[GET] /api/staff with no staff", () => {
  beforeAll(async () => {
    await client.query("DELETE from users WHERE role = 'Teacher' OR role = 'Admin'");
  });

  test("Works correctly with 0 users", async () => {
    await makeHTTPRequest(
      staffHandler,
      "/api/users/",
      undefined,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      []
    );
  });
});
