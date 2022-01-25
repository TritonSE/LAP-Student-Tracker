import { userHandler } from "../pages/api/users";
import { userIDHandler } from "../pages/api/users/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { User } from "../models/users";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const USER_NOT_FOUND_ERROR = "user not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

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

describe("[POST] /api/users", () => {
  it("creates a new user", async () => {
    const body: User = {
      id: "100",
      first_name: "John",
      last_name: "Doe",
      email: "mynaME@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  it("doesn't create a duplicate user", async () => {
    const body: User = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
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

  it("doesn't create a different user with an existing email", async () => {
    const body: User = {
      id: "54",
      first_name: "John",
      last_name: "John",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
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

  it("creates an Admin user", async () => {
    const body: User = {
      id: "50",
      first_name: "Admin",
      last_name: "Doe",
      email: "newAdmin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  it("creates an Teacher user", async () => {
    const body: User = {
      id: "45",
      first_name: "Teacher",
      last_name: "Doe",
      email: "newTeacher@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    await makeHTTPRequest(
      userHandler,
      "/api/users/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      body
    );
  });

  it("body does not have a required field", async() =>{
    const body = {
      first_name: "ABCD",
      last_name: "EFGH",
      email: "adcd@efgh.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
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
  it("look for a user that exists", async () => {
    const expected: User = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    };

    const query = {
      id: 1,
    };

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/1",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  it("fails for a user that does not exist", async () => {
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
  it("editing everything for a user that does exist", async () => {
    const expected: User = {
      id: "1",
      first_name: "Bill",
      last_name: "Brown",
      email: "john123@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phone_number: "4567890",
    };

    const query = {
      id: 1,
      
    };

    const body = {
      first_name: "Bill",
      last_name: "Brown",
      email: "john123@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phone_number: "4567890",
    }

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/1",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  it("editing few fields for a user that does exist", async () => {
    const expected: User = {
      id: "3",
      first_name: "Admin123",
      last_name: "Brown",
      email: "admin@gmail.com",
      role: "Admin",
      address: "456 Main Street",
      phone_number: "4567890",
    };

    const query = {
      id: 3,
      
    };

    const body = {
      id: "3",
      first_name: "Admin123",
      last_name: "Brown",
      address: "456 Main Street",
      phone_number: "4567890",
    }

    await makeHTTPRequest(
      userIDHandler,
      "/api/users/3",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });




  it("editing a user that does not exist", async () => {
    const query = {
      id: 101,
    };

    const body = {
      first_name: "Joe",
    }

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

  it("editing a user that exists with existing email", async () => {

    const query = {
      id: 2,
    };

    const body = {
      email: "admin@gmail.com"
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


