import eventHandler, { sessionIDHandler } from "../pages/api/class/[id]/sessions";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { StatusCodes } from "http-status-codes";
import { Any } from "io-ts";
import RRule from "rrule";

const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

let rule: string;

beforeAll(async () => {
    await client.query("DELETE from calendar_information");
    await client.query("DELETE from event_information");
    await client.query(
        "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_a', 'event_a', 'blue', 'Class', false)"
      );
      await client.query(
        "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_b', 'event_b', 'red', 'Class', false)"
      );
      await client.query(
        "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('id_c', 'event_c', 'green', 'Class', false)"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('a', id_a', '2022-02-26 21:00:00-08', '2022-02-26 21:00:00-08')"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('b', id_a', '2022-02-27 21:11:45-08', '2022-02-27 21:11:45-08')"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('c', 'id_b', '2022-02-24 21:11:45-08', '2022-02-24 21:11:45-08')"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('d', 'id_b', '2022-02-26 21:11:45-08', '2022-02-26 21:11:45-08')"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('e', 'id_c', '2022-02-23 21:11:45-08', '2022-02-23 21:11:45-08')"
      );
      await client.query(
        "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('f', 'id_c', '2022-03-01 21:11:45-08', '2022-03-01 21:11:45-08')"
      );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from calendar_information");
  await client.end();
});

type sessionId= {
  session_id: string,
  start_str: string
}

describe("[GET] /api/class/[id]/sessions", () => {
  test("get session ids before time", async() => {
    const queryParams = {
      until:"2022-02-27T17:00:00.000Z",
    };
    const query = { 
      id:"id_a",
    }
    const expected:sessionId[] = [
      {
        session_id: 'a',
        start_str: '2022-02-23 21:11:45-08'},
    ];

    await makeHTTPRequest(
      sessionIDHandler,
      "/api/class/id_a/sessions",
      query,
      "GET",
      queryParams,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});
