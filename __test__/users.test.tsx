<<<<<<< HEAD
import { apiResolver, __ApiPreviewProps } from "next/dist/server/api-utils";
import http from "http";
=======
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
import { userHandler } from "../pages/api/users";
import { userIDHandler } from "../pages/api/users/[id]";
import { staffHandler } from "../pages/api/staff"
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { User } from "../models/users";
import { userIDHandler } from "../pages/api/users/[id]";

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
<<<<<<< HEAD
    const res = await makeHTTPRequest(server, "/api/users/", "POST", body, 201, body)
=======
    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 201, body);
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
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

<<<<<<< HEAD
    const error = { 
      "error": "Internal Server Error"
    }
    const res = await makeHTTPRequest(server, "/api/users/", "POST", body, 500, error)
=======

    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 500, INTERNAL_SERVER_ERROR)

>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
  });

  it("creates an Admin user", async () => {
    const body = {
<<<<<<< HEAD
      id: "2",
=======
      id: "50",
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
      first_name: "Admin",
      last_name: "Doe",
      email: "newAdmin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
<<<<<<< HEAD
    const res = await makeHTTPRequest(server, "/api/users/", "POST", body, 201, body)
=======
    await makeHTTPRequest(userHandler, "/api/users/", undefined, "POST", body, 201, body)
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues

  });

  it("creates an Teacher user", async () => {
    const body = {
<<<<<<< HEAD
      id: "3",
=======
      id: "45",
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
      first_name: "Teacher",
      last_name: "Doe",
      email: "newTeacher@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
<<<<<<< HEAD
    const res = await makeHTTPRequest(server, "/api/users/", "POST", body, 201, body)

=======
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
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
  });

<<<<<<< HEAD
// describe("[GET] /api/users/[id]", () => {
//   let server: http.Server;

//   // this mocks an http server for our app so we can test our API
//   beforeEach(async () => {
//     const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
//       apiResolver(request, response, undefined, userIDHandler, preview, true);
//     server = http.createServer(requestHandler);

//     await client.query("DELETE from users;");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890');");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890');");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890');");
//   });

//   afterEach(() => {
//     server.close();
//   });

//   // find a user
//   it("look for a user that exists", async () => {
//     // send the request, and test the results
//     // we use supertest to make sure that the response code and the response
//     // type is what we expect
//     // await supertest(server).get("/api/users/1").expect("Content-Type", /json/).expect(200);
//     const expected = {
//       id: "1",
//       first_name: "John",
//       last_name: "Doe",
//       email: "john@gmail.com",
//       role: "Student",
//       address: "123 Main Street",
//       phone_number: "1234567890",
//     };
//     const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, expected)
//   });

//   // find a user that doesnt exist
//   it("look for a user that doesnt exist", async () => {
//     // send the request, and test the results
//     // we use supertest to make sure that the response code and the response
//     // type is what we expect
//     // await supertest(server).get("/api/users/10").expect("Content-Type", /json/).expect(500);
//     const error = { 
//       "error": "Internal Server Error"
//     }
//     const res = await makeHTTPRequest(server, "/api/users/10", "GET", undefined, 500, error)
//   });
// });

describe("[GET] /api/staff", () => {
  let server: http.Server;

  // this mocks an http server for our app so we can test our API
  beforeEach(async () => {
    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
      apiResolver(request, response, undefined, staffHandler, preview, true);
    server = http.createServer(requestHandler);
    await client.query("DELETE from users;");
    await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890');");
    await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890');");
    await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890');");
  });
=======
  it("fails for a user that does not exist", async () => {
    const query = {
      id: 101
    }

    await makeHTTPRequest(userIDHandler, "/api/users/101", query, "GET", undefined, 400, USER_NOT_FOUND_ERROR)
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues


<<<<<<< HEAD
  // find all staff
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
      }
      
    ];
    const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, expected)
  });

  // find staff when there are none
  it("look for all staff when there are none", async () => {
    client.query("DELETE from users");
    const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, [])
  });
=======

  })
>>>>>>> hotfix/Anshul-Birla/fix-jest-issues
});


// describe("[GET] /api/users/[id]", () => {
//   let server: http.Server;

//   // this mocks an http server for our app so we can test our API
//   beforeEach(async () => {
//     const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
//       apiResolver(request, response, undefined, userIDHandler, preview, true);
//     server = http.createServer(requestHandler);
//   });

//   afterEach(() => {
//     server.close();
//   });

//   // find a user
//   it("look for a user that exists", async () => {
//     // send the request, and test the results
//     // we use supertest to make sure that the response code and the response
//     // type is what we expect
//     // await supertest(server).get("/api/users/1").expect("Content-Type", /json/).expect(200);
//     const expected: User = {
//       id: "1",
//       first_name: "John",
//       last_name: "Doe",
//       email: "john@gmail.com",
//       role: "Student",
//       address: "123 Main Street",
//       phone_number: "1234567890",
//     };

//     // const request = createRequest({
//     //   method: 'GET',
//     //   url: '/users/1',
//     //   params: {
//     //     jello: 42
//     //   }
//     // });


//     const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
//       method: 'GET',
//       url: '/api/users/1',
//       query: {
//         "id": "1"
//       }
//     });

//     await userIDHandler(req, res)

//     console.log(res._getStatusCode())
//     expect(res._getStatusCode()).toBe(200)



//     //const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, expected)
//   });

// // find a user that doesnt exist
// it("look for a user that doesnt exist", async () => {
//   // send the request, and test the results
//   // we use supertest to make sure that the response code and the response
//   // type is what we expect
//   // await supertest(server).get("/api/users/10").expect("Content-Type", /json/).expect(500);
//   const error = {
//     "error": "Internal Server Error"
//   }
//   const res = await makeHTTPRequest(server, "/api/users/10", "GET", undefined, 500, error)
// });
//});

// describe("[GET] /api/staff", () => {
//   let server: http.Server;

//   // this mocks an http server for our app so we can test our API
//   beforeEach(async () => {
//     const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
//       apiResolver(request, response, undefined, staffHandler, preview, true);
//     server = http.createServer(requestHandler);
//     await client.query("DELETE from users;");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('1', 'John', 'Doe', 'john@gmail.com', 'Student', '123 Main Street', '1234567890');");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('2', 'Teacher', 'Doe', 'teacher@gmail.com', 'Teacher', '123 Main Street', '1234567890');");
//     await client.query("INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('3', 'Admin', 'Doe', 'admin@gmail.com', 'Admin', '123 Main Street', '1234567890');");
//   });

//   afterEach(() => {
//     server.close();
//   });

//   // find all staff
//   it("look for all staff", async () => {

//     const expected = [
//       {
//         id: "2",
//         first_name: "Teacher",
//         last_name: "Doe",
//         email: "teacher@gmail.com",
//         role: "Teacher",
//         address: "123 Main Street",
//         phone_number: "1234567890",
//       },
//       {
//         id: "3",
//         first_name: "Admin",
//         last_name: "Doe",
//         email: "admin@gmail.com",
//         role: "Admin",
//         address: "123 Main Street",
//         phone_number: "1234567890",
//       }

//     ];
//     const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, expected)
//   });

//   // find staff when there are none
//   it("look for all staff when there are none", async () => {
//     client.query("DELETE from users");
//     const res = await makeHTTPRequest(server, "/api/users/1", "GET", undefined, 200, [])
//   });
// });
