import availabilityIdHandler from "../pages/api/availability/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { StatusCodes } from "http-status-codes";
import { Availability } from "../models/availability";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availabilities");
  await client.query("DELETE from images");

  await client.query("INSERT into images (id) VALUES('1')");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890', '1')"
  );
  await client.query(
    "INSERT INTO availabilities (user_id, time_zone) VALUES ('2', 'America/Los_Angeles')"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availabilities");
  await client.end();
});

const AVAILABILITY_NOT_FOUND_ERROR = "Availability of user not found";
describe("[GET] /api/availability/[id]", () => {
  test("Getting a users availability", async () => {
    const expected: Availability = {
      mon: null,
      tue: null,
      wed: null,
      thu: null,
      fri: null,
      sat: null,
      timeZone: "America/Los_Angeles",
    };
    const query = {
      id: "2",
    };

    await makeHTTPRequest(
      availabilityIdHandler,
      "/api/availability/2",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("Get availability of user that does not exist", async () => {
    const query = {
      id: "non-existent",
    };
    await makeHTTPRequest(
      availabilityIdHandler,
      "/api/availability/2",
      query,
      "GET",
      undefined,
      StatusCodes.NOT_FOUND,
      AVAILABILITY_NOT_FOUND_ERROR
    );
  });
});

describe("[PATCH] /api/availabilities/[id]", () => {
  test("Editing a users availability", async () => {
    const body: Availability = {
      mon: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      tue: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      wed: null,
      thu: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      fri: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      sat: null,
      timeZone: "America/Los_Angeles",
    };

    const query = {
      id: "2",
    };

    await makeHTTPRequest(
      availabilityIdHandler,
      "/api/availability/2",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("Editing availability of a user that does not exist", async () => {
    const body: Availability = {
      mon: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      tue: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      wed: null,
      thu: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      fri: [
        ["08:00", "10:00"],
        ["11:00", "12:00"],
      ],
      sat: null,
      timeZone: "America/Los_Angeles",
    };
    const query = {
      id: "non-existent",
    };

    await makeHTTPRequest(
      availabilityIdHandler,
      "/api/availability/non-existent",
      query,
      "PATCH",
      body,
      StatusCodes.NOT_FOUND,
      AVAILABILITY_NOT_FOUND_ERROR
    );
  });
});
