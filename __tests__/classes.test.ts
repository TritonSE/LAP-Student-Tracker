import { classHandler } from "../pages/api/class";
import { classIDHandler } from "../pages/api/class/[id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { Class, CreateClass, UpdateClass } from "../models/class";
import { StatusCodes } from "http-status-codes";

const INTERNAL_SERVER_ERROR = "Internal Server Error";
const CLASS_NOT_FOUND_ERROR = "class not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from event_Information");
  await client.query("DELETE from users");
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('11', 'class1', 'blue', 'Class', false)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('22', 'class2', 'green', 'Class', true)"
  );
  await client.query(
    "INSERT INTO event_Information(id, name, background_color, type, never_ending) VALUES('33', 'class3', 'green', 'Class', true)"
  );
  await client.query("DELETE from classes");
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('11', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('33', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'english')"
  );
  await client.query(
    "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('44', 'Bill', 'Test', 'bt@gmail.com', 'Teacher', '14 nowhere lane', '123-456-7892')",
  );
  await client.query("DELETE from commitments");
  await client.query(
    "INSERT INTO commitments(user_id, event_information_id) VALUES('44', '11')",
  );


});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from commitments");
});

describe("[POST] /api/class", () => {
  beforeAll(async () => {
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('44', '33')",
    );
  });
  test("creates a new class", async () => {
    const body: Class = {
      name: "class3",
      eventInformationId: "33",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
      teachers: []
    };

    const expected: Class = {
      name: "class3",
      eventInformationId: "33",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
      teachers: []
    };

    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("doesn't create a duplicate class", async () => {
    const body: CreateClass = {
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
    };

    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  });

  test("body does not have a required field", async () => {
    const body = {
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      startTime: "07:34Z",
      endTime: "08:34Z",
    };
    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      FIELDS_NOT_ENTERED_CORRECTLY
    );
  });
});

describe("[GET] /api/class/[id]", () => {
  test("look for a class that exists", async () => {
    const expected: Class = {
      name: "class1",
      eventInformationId: "11",
      minLevel: 3,
      maxLevel: 5,
      rrstring:
        "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "english",
      teachers: [
        {firstName: "Bill",
               lastName: "Test",
               userId: "44"}
      ]
    };

    const query = {
      id: "11",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("fails for a class that does not exist", async () => {
    const query = {
      id: "not_a_real_id",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/not_a_real_id",
      query,
      "GET",
      undefined,
      404,
      CLASS_NOT_FOUND_ERROR
    );
  });
});

describe("[PATCH] /api/class/[id]", () => {
  test("editing everything for a class that does exist", async () => {
    const expected: Class = {
      name: "class1",
      eventInformationId: "11",
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "Java",
      teachers: [{firstName: "Bill",
      lastName: "Test",
      userId: "44"}]
    };

    const query = {
      id: "11",
    };

    const body: UpdateClass = {
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      language: "Java",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing few fields for a class that does exist", async () => {
    const expected: Class = {
      name: "class1",
      eventInformationId: "11",
      minLevel: 4,
      maxLevel: 6,
      rrstring:
        "DTSTART:20230222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20240222T093000Z;BYDAY=TU,FR;INTERVAL=1",
      startTime: "07:34Z",
      endTime: "08:34Z",
      language: "Java",
      teachers: [{firstName: "Bill",
      lastName: "Test",
      userId: "44"}]
    };

    const query = {
      id: "11",
    };

    const body: UpdateClass = {
      minLevel: 4,
      maxLevel: 6,
      language: "Java",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/11",
      query,
      "PATCH",
      body,
      StatusCodes.CREATED,
      expected
    );
  });

  test("editing a class that does not exist", async () => {
    const query = {
      id: "not_a_real_id",
    };

    const body: UpdateClass = {
      language: "Python",
    };

    await makeHTTPRequest(
      classIDHandler,
      "/api/class/not_a_real_id",
      query,
      "PATCH",
      body,
      404,
      CLASS_NOT_FOUND_ERROR
    );
  });
});
describe("[GET] /api/class", () => {
  beforeAll(async () => {
    await client.query("DELETE from classes");
    await client.query(
      "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('11', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'C++')"
    );
    await client.query(
      "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('22', 4, 6, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO;INTERVAL=1', '06:34Z', '07:40Z', 'Java')"
    );
    await client.query(
      "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('33', 1, 3, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=WE,TH;INTERVAL=1', '01:00Z', '02:00Z', 'Python')"
    );
    await client.query("DELETE from users");
    await client.query(
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('77', 'John', 'Doe', 'john@gmail.com', 'Teacher', '000 nowhere lane', '123-456-7890')",
    );
    await client.query(
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('88', 'David', 'Roberts', 'david@gmail.com', 'Teacher', '123 nowhere lane', '123-456-7891')",
    );
    await client.query(
      "INSERT INTO users(id, first_name, last_name, email, role, address, phone_number) VALUES('99', 'Bill', 'Nye', 'bill@gmail.com', 'Teacher', '345 nowhere lane', '123-456-7892')",
    );
    await client.query("DELETE from commitments");
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('77', '11')",
    );
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('88', '22')",
    );
    await client.query(
      "INSERT INTO commitments(user_id, event_information_id) VALUES('99', '33')",
    );

  });
  test("get all classes", async () => {
    const expected: Class[] = [
      {
        name: "class1",
        eventInformationId: "11",
        minLevel: 3,
        maxLevel: 5,
        rrstring:
          "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1",
        startTime: "07:34Z",
        endTime: "08:34Z",
        language: "C++",
        teachers: [
          {userId: "77", firstName: "John", lastName: "Doe"
          }
        ]
      },
      {
        name: "class2",
        eventInformationId: "22",
        minLevel: 4,
        maxLevel: 6,
        rrstring:
          "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO;INTERVAL=1",
        startTime: "06:34Z",
        endTime: "07:40Z",
        language: "Java",
        teachers: [
          {userId: "88", firstName: "David", lastName: "Roberts"
          }
        ]
      },
      {
        name: "class3",
        eventInformationId: "33",
        minLevel: 1,
        maxLevel: 3,
        rrstring:
          "DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=WE,TH;INTERVAL=1",
        startTime: "01:00Z",
        endTime: "02:00Z",
        language: "Python",
        teachers: [
          {userId: "99", firstName: "Bill", lastName: "Nye"
          }
        ]
      },
    ];
    await makeHTTPRequest(
      classHandler,
      "/api/class",
      undefined,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });
});

describe("[GET] /api/class with no classes", () => {
  beforeAll(async () => {
    await client.query("DELETE from classes");
  });

  test("Works with no classes", async () => {
    await makeHTTPRequest(
      classHandler,
      "/api/class/",
      undefined,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      []
    );
  });
});
