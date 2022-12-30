import parentStudentHandler from "../pages/api/parents/[id]/student";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { CreateParentStudentLink, ParentStudentLink } from "../models";
import { StatusCodes } from "http-status-codes";

const STUDENT_NOT_FOUND_ERROR = "Student not found";
beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE from event_information");
  await client.query("DELETE from commitments");
  await client.query("DELETE from classes");
  await client.query("DELETE from images");
  await client.query("INSERT INTO images(id) VALUES('1')");
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, date_created, picture_id) VALUES('2', 'Jane', 'Doe', 'jane@gmail.com', 'Parent', '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, approved, address, phone_number, date_created, picture_id) VALUES('3', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', false, '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, approved, address, phone_number, date_created, picture_id) VALUES('4', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', false, '123 Main Street', '1234567890', '5/23/2022, 4:45:03 AM', '1')"
  );
});

afterAll(async () => {
  await client.query("DELETE from users");
  await client.end();
});

describe("[POST] /api/parents/[id]/student", () => {
  test("Create a valid parent-student link", async () => {
    const body: CreateParentStudentLink = {
      email: "john@gmail.com",
    };
    const query = {
      id: "2",
    };
    const expected: ParentStudentLink = {
      parentId: "2",
      studentId: "1",
    };
    await makeHTTPRequest(
      parentStudentHandler,
      "/api/parents/2/student",
      query,
      "POST",
      body,
      StatusCodes.ACCEPTED,
      expected
    );
  });
  test("Create an invalid link between a parent and a non-student", async () => {
    const body: CreateParentStudentLink = {
      email: "teacher@gmail.com",
    };
    const query = {
      id: "2",
    };
    await makeHTTPRequest(
      parentStudentHandler,
      "/api/parents/2/student",
      query,
      "POST",
      body,
      StatusCodes.NOT_FOUND,
      STUDENT_NOT_FOUND_ERROR
    );
  });
  test("Create an invalid link between a parent and a nonexistent user", async () => {
    const body: CreateParentStudentLink = {
      email: "notAnEmail@gmail.com",
    };
    const query = {
      id: "2",
    };
    await makeHTTPRequest(
      parentStudentHandler,
      "/api/parents/2/student",
      query,
      "POST",
      body,
      StatusCodes.NOT_FOUND,
      STUDENT_NOT_FOUND_ERROR
    );
  });
});
