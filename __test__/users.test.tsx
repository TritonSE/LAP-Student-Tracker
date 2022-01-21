import { apiResolver, __ApiPreviewProps } from "next/dist/server/api-utils";
import http from "http";
import supertest from "supertest";
import { userHandler } from "../pages/api/users";
import { client } from "../lib/db";

const preview: __ApiPreviewProps = {
  previewModeId: "",
  previewModeEncryptionKey: "",
  previewModeSigningKey: "",
};

beforeAll(() => {
  client.query("DELETE from users");
});

afterAll(() => {
  client.end();
});

describe("[POST] /api/users", () => {
  let server: http.Server;

  // this mocks an http server for our app so we can test our API
  beforeEach(async () => {
    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
      apiResolver(request, response, undefined, userHandler, preview, true);
    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  // tests actually creating a new user into our database
  it("creates a new user", async () => {
    const body = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@gmail.com",
      role: "Student",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server)
      .post("/api/users")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(201);
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
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server)
      .post("/api/users")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(500);
  });

  it("creates an Admin user", async () => {
    const body = {
      id: "1",
      first_name: "Admin",
      last_name: "Doe",
      email: "admin@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server)
      .post("/api/users")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(201);
  });

  it("creates an Teacher user", async () => {
    const body = {
      id: "1",
      first_name: "Teacher",
      last_name: "Doe",
      email: "teacher@gmail.com",
      role: "Admin",
      address: "123 Main Street",
      phone_number: "1234567890",
    };
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server)
      .post("/api/users")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(201);
  });
});

describe("[GET] /api/users/[id]", () => {
  let server: http.Server;

  // this mocks an http server for our app so we can test our API
  beforeEach(async () => {
    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
      apiResolver(request, response, undefined, userHandler, preview, true);
    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  // find a user
  it("look for a user that exists", async () => {
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server).get("/api/users/1").expect("Content-Type", /json/).expect(200);
  });

  // find a user
  it("look for a user that doesnt exist", async () => {
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server).get("/api/users/10").expect("Content-Type", /json/).expect(500);
  });
});

describe("[GET] /api/staff", () => {
  let server: http.Server;

  // this mocks an http server for our app so we can test our API
  beforeEach(async () => {
    const requestHandler = (request: http.IncomingMessage, response: http.ServerResponse) =>
      apiResolver(request, response, undefined, userHandler, preview, true);
    server = http.createServer(requestHandler);
  });

  afterEach(() => {
    server.close();
  });

  // find all staff
  it("look all staff", async () => {
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server).get("/api/staff").expect("Content-Type", /json/).expect(200);
  });

  // find staff
  it("look for all staff when there are none", async () => {
    client.query("DELETE from users");
    // send the request, and test the results
    // we use supertest to make sure that the response code and the response
    // type is what we expect
    await supertest(server).get("/api/users/10").expect("Content-Type", /json/).expect(500);
  });
});
