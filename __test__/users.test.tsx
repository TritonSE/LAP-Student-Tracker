import { userHandler } from "../pages/api/users";
import { userIDHandler } from "../pages/api/users/[id]";
import { staffHandler } from "../pages/api/staff"
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { User } from "../models/users";

const INTERNAL_SERVER_ERROR = { error: "Internal Server Error" }
const USER_NOT_FOUND_ERROR = "user not found";

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890')");
  await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890')");
  await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890')");
});

afterAll(async () => {
  await client.end();
});

describe("[POST] /api/users", () => {
  it("creates a new user", async () => {
    const body = {
      id: "100",
      first_name: "John",
      last_name: "Doe",
      email: "mynaME@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 201, body);
  });

  it("creates a duplicate user", async () => {
    const body = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    };


    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 500, INTERNAL_SERVER_ERROR)

  });

  it("creates an Admin user", async () => {
    const body = {
      id: "50",
      first_name: "Admin",
      last_name: "Doe",
      email: "newAdmin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 201, body)

  });

  it("creates an Teacher user", async () => {
    const body = {
      id: "45",
      first_name: "Teacher",
      last_name: "Doe",
      email: "newTeacher@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 201, body)

  });
});

describe("[GET] /api/users/[id]", () => {
  it("look for a user that exists", async () => {
    const expected: User = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    }

    const query = {
      id: 1
    }

    await makeHTTPRequest(userIDHandler, "/api/users/1", query, "GET", undefined, 200, expected)
  });

  it("fails for a user that does not exist", async () => {
    const query = {
      id: 101
    }

    await makeHTTPRequest(userIDHandler, "/api/users/101", query, "GET", undefined, 400, USER_NOT_FOUND_ERROR)

  })
});

describe("[GET] /api/staff", () => {
  it("look for all staff", async () => {

    const expected = [
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
      {
        id: "50",
        first_name: "Admin",
        last_name: "Doe",
        email: "newAdmin@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phone_number: "1234567890",
      },
      {
        id: "45",
        first_name: "Teacher",
        last_name: "Doe",
        email: "newTeacher@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phone_number: "1234567890",
      }

    ];
    await makeHTTPRequest(staffHandler, "/api/users/1", undefined, "GET", undefined, 200, expected)
  });

  it("look for all staff when there are none", async () => {
    client.query("DELETE from users");
    await makeHTTPRequest(staffHandler, "/api/users/1", undefined, "GET", undefined, 200, [])
  });
});