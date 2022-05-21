import { sessionHandler } from "../pages/api/class/[id]/sessions";
import { sessionIDHandler } from "../pages/api/class/[id]/attendance/[session_id]"
import { userAttendanceHandler } from "../pages/api/users/[id]/attendance/[class_id]"
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { StatusCodes } from "http-status-codes";
import { Attendance, CreateAttendance , SingleUserAttendance} from "../models/attendance";
import { Any } from "io-ts";
import RRule from "rrule";

const INTERNAL_SERVER_ERROR = "Internal Server Error";

let rule: string;

beforeAll(async () => {
    await client.query("DELETE from event_information");
    await client.query("DELETE from calendar_information");
    await client.query("DELETE from commitments");
    await client.query("DELETE from users");
    await client.query("DELETE from attendance");
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
      "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('a', 'id_a', '2022-02-26 21:00:00-08', '2022-02-26 21:00:00-08')"
    );
    await client.query(
      "INSERT INTO calendar_information(session_id, event_information_id, start_str, end_str) VALUES('b', 'id_a', '2022-02-28 21:11:45-08', '2022-02-28 21:11:45-08')"
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
    await client.query(
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890')"
    );
    await client.query(
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'John', 'Smith', 'smith@gmail.com', 'Student', '123 Main Street', '1234567890')"
    );
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('1', 'id_a')"
    );
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('2', 'id_a')"
    );
    await client.query(
      "INSERT INTO attendance(session_id, attendance, class_id, user_id) VALUES ('a', 'Excused', 'id_a', '1')"
    );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
    await client.query("DELETE from calendar_information");
    await client.query("DELETE from commitments");
    await client.query("DELETE from users");
    await client.query("DELETE from attendance");
  await client.end();
});

type sessionId= {
  sessionId: string,
  startStr: string
}

describe("[GET] /api/class/[id]/sessions", () => {
  test("get session ids before specified time", async() => {
    const query = { 
      id:"id_a",
      until: "2022-02-27T17:00:00.000Z",
    }
    const expected:sessionId[] = [
      {
        sessionId: "a",
        startStr: "2022-02-27T05:00:00.000Z",
      },
    ];
    await makeHTTPRequest(
      sessionHandler,
      "/api/class/id_a/sessions/?until=2022-02-27T17:00:00.000Z",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get session ids without specified time", async() => {
    const query = { 
      id:"id_a",
    }
    const expected:sessionId[] = [
      {
        sessionId: "a",
        startStr: "2022-02-27T05:00:00.000Z",
      },
      {
        sessionId: "b",
        startStr: "2022-03-01T05:11:45.000Z",
      },

    ];
    await makeHTTPRequest(
      sessionHandler,
      "/api/class/id_a/sessions/",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

describe("[GET] /api/class/[id]/attendance/[session_id]", () => {
  test("get attendances for users in a class section", async() => {
    const query = {
      id: "id_a",
      session_id: "a"
    }
    const expected: Attendance[] = [
      {
        sessionId: 'a',
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        attendance: 'Excused',
      },
      {
        sessionId: 'a',
        userId: '2',
        firstName: 'John',
        lastName: 'Smith',
        attendance: null,
      },
    ];
    await makeHTTPRequest(
      sessionIDHandler,
      "/api/class/id_a/attendance/a",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

describe("[POST] /api/class/[id]/attendance/[session_id]", () => {
  test("add attendances for user in a class section", async() => {
    const query = {
      id: "id_a",
      session_id: "a"
    }
    const body: CreateAttendance[] = [
      {
        userId: '2',
        attendance: 'Unexcused',
      }
    ];
    const expected: Attendance[] = [
      {
        sessionId: 'a',
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        attendance: 'Excused',
      },
      {
        sessionId: 'a',
        userId: '2',
        firstName: 'John',
        lastName: 'Smith',
        attendance: 'Unexcused',
      },
    ];
    await makeHTTPRequest(
      sessionIDHandler,
      "/api/class/id_a/attendance/a/",
      query,
      "POST",
      body,
      StatusCodes.CREATED,
      expected
    );
  });
  test("update attendances for user in a class section", async() => {
    const query = {
      id: "id_a",
      session_id: "a"
    }
    const body: CreateAttendance[] = [
      {
        userId: '1',
        attendance: 'Present',
      },
      {
        userId: '2',
        attendance: 'Unexcused',
      }
    ];
    const expected: Attendance[] = [
      {
        sessionId: 'a',
        userId: '1',
        firstName: 'John',
        lastName: 'Doe',
        attendance: 'Present',
      },
      {
        sessionId: 'a',
        userId: '2',
        firstName: 'John',
        lastName: 'Smith',
        attendance: 'Unexcused',
      },
    ];
    await makeHTTPRequest(
      sessionIDHandler,
      "/api/class/id_a/attendance/a/",
      query,
      "POST",
      body,
      StatusCodes.CREATED,
      expected
    );
  });
});

describe("[GET] /api/users/[id]/attendence/[class_id]", () => {
  test("get single user attendances for specified user in a class", async() => {
    const query = {
      id: "1",
      class_id: "id_a"
    }
    const expected: SingleUserAttendance[] = [
      {
        sessionId: 'a',
        userId: '1',
        attendance: 'Excused',
        start: '2022-02-27T05:00:00.000Z',
      },
      {
        sessionId: 'b',
        userId: '1',
        attendance: null,
        start: '2022-03-01T05:11:45.000Z',
      },
    ];
    await makeHTTPRequest(
      userAttendanceHandler,
      "/api/users/1/attendance/id_a/",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

