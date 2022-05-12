import userHandler from "../pages/api/users";
import userIDHandler from "../pages/api/users/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest, makeUserHTTPRequest } from "./__testutils__/testutils.test";
import { UpdateUser, User } from "../models/users";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "user not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE FROM images");
  await client.query("INSERT INTO images (id) VALUES('1')");
  await client.query("INSERT INTO images (id) VALUES('2')");
  await client.query("INSERT INTO images (id) VALUES('3')");

  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('4', 'John', 'Doe', 'john2@gmail.com', 'Student', '123 Main Street', '1234567890', '1')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890', '2')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('5', 'Teacher', 'Doe', 'teacher2@gmail.com', 'Teacher', '123 Main Street', '1234567890', '2')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890',  '3')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number, picture_id) VALUES('6', 'Admin', 'Doe', 'admin2@gmail.com', 'Admin', '123 Main Street', '1234567890', '3')"
  );
});

afterAll(async () => {
  await client.query("DELETE from users");
  await client.query("DELETE from images");
  await client.end();
});

describe("[GET] /api/users/?filter", () => {
  test("look for all users", async () => {
    const expected: User[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        role: "Student",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "4",
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        role: "Student",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "2",
        firstName: "Teacher",
        lastName: "Doe",
        email: "teacher@gmail.com",
        role: "Teacher",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "5",
        firstName: "Teacher",
        lastName: "Doe",
        email: "teacher2@gmail.com",
        role: "Teacher",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "3",
        firstName: "Admin",
        lastName: "Doe",
        email: "admin@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "6",
        firstName: "Admin",
        lastName: "Doe",
        email: "admin2@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
    ];

    const res = await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "GET",
      undefined,
      StatusCodes.OK,
      undefined
    );

    const returnedUsers = JSON.parse(res._getData());

    expect(expected.length).toBe(returnedUsers.length);
    expect(returnedUsers).toEqual(expect.arrayContaining(returnedUsers));
  });

  test("look for all teachers", async () => {
    const expected: User[] = [
      {
        id: "2",
        firstName: "Teacher",
        lastName: "Doe",
        email: "teacher@gmail.com",
        role: "Teacher",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "5",
        firstName: "Teacher",
        lastName: "Doe",
        email: "teacher2@gmail.com",
        role: "Teacher",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
    ];

    const query = {
      role: "Teacher",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expected
    );
  });

  test("look for all students", async () => {
    const expected: User[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        role: "Student",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "4",
        firstName: "John",
        lastName: "Doe",
        email: "john2@gmail.com",
        role: "Student",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
    ];

    const query = {
      role: "Student",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expected
    );
  });

  test("look for all admin", async () => {
    const expected: User[] = [
      {
        id: "3",
        firstName: "Admin",
        lastName: "Doe",
        email: "admin@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
      {
        id: "6",
        firstName: "Admin",
        lastName: "Doe",
        email: "admin2@gmail.com",
        role: "Admin",
        address: "123 Main Street",
        phoneNumber: "1234567890",
      },
    ];

    const query = {
      role: "Admin",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      query,
      "GET",
      undefined,
      StatusCodes.OK,
      expected
    );
  });

  test("look for a role that does not exist", async () => {
    const query = {
      role: "DOES_NOT_EXIST",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      query,
      "GET",
      undefined,
      StatusCodes.BAD_REQUEST,
      "Query parameter refers to role that does not exist"
    );
  });
});

describe("[POST] /api/users", () => {
  test("creates a new user", async () => {
    const body: User = {
      id: "100",
      firstName: "John",
      lastName: "Doe",
      email: "mynaME@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };
    await makeUserHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("doesn't create a duplicate user", async () => {
    const body: User = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });

  test("doesn't create a different user with an existing email", async () => {
    const body: User = {
      id: "54",
      firstName: "John",
      lastName: "John",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };

    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });

  test("creates an Admin user", async () => {
    const body: User = {
      id: "50",
      firstName: "Admin",
      lastName: "Doe",
      email: "newAdmin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };
    await makeUserHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("creates an Teacher user", async () => {
    const body: User = {
      id: "45",
      firstName: "Teacher",
      lastName: "Doe",
      email: "newTeacher@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };
    await makeUserHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  test("body does not have a required field", async () => {
    const body = {
      firstName: "ABCD",
      lastName: "EFGH",
      email: "adcd@efgh.com",
      role: "Student",
      address: "123 Main Street",
      phoneNumber: "1234567890",
    };
    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      FIELDS_NOT_ENTERED_CORRECTLY
    );
  });
});

describe("[GET] /api/users/[id]", () => {
  test("look for a user that exists", async () => {
    const expected: User = {
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
    );
  });

  test("fails for a user that does not exist", async () => {
    const query = {
      id: 101,
    };

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/101",
      query,
      "GET",
      undefined,
      404,
      USER_NOT_FOUND_ERROR
    );
  });
});

describe("[PATCH] /api/users/[id]", () => {
  test("editing everything for a user that does exist", async () => {
    const expected: User = {
      id: "1",
      firstName: "Bill",
      lastName: "Brown",
      email: "john123@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phoneNumber: "4567890",
    };

    const query = {
      id: 1,
    };

    const body: UpdateUser = {
      firstName: "Bill",
      lastName: "Brown",
      email: "john123@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phoneNumber: "4567890",
    };

    await makeUserHTTPRequest(
      userIDHandler,
      "/api/users/1",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing few fields for a user that does exist", async () => {
    const expected: User = {
      id: "3",
      firstName: "Admin123",
      lastName: "Brown",
      email: "admin@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phoneNumber: "4567890",
    };

    const query = {
      id: 3,
    };

    const body: UpdateUser = {
      firstName: "Admin123",
      lastName: "Brown",
      address: "456 Main Street",
      phoneNumber: "4567890",
    };

    await makeUserHTTPRequest(
      userIDHandler,
      "/api/users/3",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing a user that does not exist", async () => {
    const query = {
      id: 101,
    };

    const body: UpdateUser = {
      firstName: "Joe",
    };

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/101",
      query,
      "PATCH",
      body,
      404,
      USER_NOT_FOUND_ERROR
    );
  });

  test("editing a user that exists with existing email", async () => {
    const query = {
      id: 2,
    };

    const body = {
      email: "admin@gmail.com",
    };

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/2",
      query,
      "PATCH",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });
});
