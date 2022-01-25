import { staffHandler } from "../pages/api/staff";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { User } from "../models/users";
import { StatusCodes } from "http-status-codes";

beforeAll(async () => {
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
  await client.end();
});

describe("[GET] /api/staff", () => {
  it("look for all staff", async () => {
    const expected: User[] = [
      {
        id: "2",
        first_name: "Teacher",
        last_name: "Doe",
        email: "teacher@gmail.com",
        role: "Teacher",
        address: "123 Main Street",
        phone_number: "1234567890",
      },
      {
        id: "3",
        first_name: "Admin",
        last_name: "Doe",
        email: "admin@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phone_number: "1234567890",
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
      await client.query("DELETE from users WHERE role = 'Teacher' OR role = 'Admin'")
    })
  
    it("Works correctly with 0 users", async () => {
      await makeHTTPRequest(staffHandler, "/api/users/", undefined, "GET", undefined, StatusCodes.ACCEPTED, []);
    });
  
  })