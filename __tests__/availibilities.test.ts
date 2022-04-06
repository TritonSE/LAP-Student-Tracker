import availibilityIdHandler from "../pages/api/availibility/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { StatusCodes } from "http-status-codes";
import { Availibility } from "../models/availibility";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availibilities");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890')"
  );
  await client.query(
    "INSERT INTO availibilities (user_id, time_zone) VALUES ('2', 	'America/Los_Angeles')"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from users");
  await client.query("DELETE from availibilities");
  client.end();
});

describe("[GET] /api/availibility/[id]", () => {
  test("Getting a users availibility", async () => {
    const expected: Availibility = {
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
      availibilityIdHandler,
      "/api/availibility/2",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("Get avaiibility of user that does not exist", async () => {
    const query = {
      id: "non-existant",
    };
    await makeHTTPRequest(
      availibilityIdHandler,
      "/api/availibility/2",
      query,
      "GET",
      undefined,
      StatusCodes.NOT_FOUND,
      "Availibility of user not found"
    );
  });
});

describe("[PATCH] /api/availibilities/[id]", () => {
  test("Editing a users availibility", async () => {
    const body: Availibility = {
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
      availibilityIdHandler,
      "/api/availibility/2",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("Editing availibility of a user that does not exist", async () => {
    const body: Availibility = {
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
      availibilityIdHandler,
      "/api/availibility/non-existent",
      query,
      "PATCH",
      body,
      StatusCodes.NOT_FOUND,
      "Availibility of user not found"
    );
  });
});
