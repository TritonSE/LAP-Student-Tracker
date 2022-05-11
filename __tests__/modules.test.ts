import classModulesHandler from "../pages/api/class/[id]/modules";
import moduleHandler from "../pages/api/module/[id]";
import createModuleHandler from "../pages/api/module";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { Module, CreateModule } from "../models/modules";
import { StatusCodes } from "http-status-codes";

const CLASS_NOT_FOUND_ERROR = "class not found";
const MODULE_NOT_FOUND_ERROR = "module not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_1', 'CSE 8A', 'blue', 'Class', 'false')"
  );
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_2', 'CSE 11', 'red', 'Class', 'false')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('e_1', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'Python')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('e_2', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'Java')"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_1', 'e_1', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_2', 'e_1', 'Week 2', 1)"
  );  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_3', 'e_1', 'Week 3', 2)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_4', 'e_2', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_5', 'e_2', 'Week 2', 1)"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
  await client.end();
});

describe("[GET] /api/class/[id]/modules", () => {
  test("get all modules for a class", async () => {
    const expected: Module[] = [
      {
        classId: 'e_1',
        moduleId: 'm_1',
        name: 'Week 1',
        position: 0,
      },
      {
        classId: 'e_1',
        moduleId: 'm_2',
        name: 'Week 2',
        position: 1,
      },
      {
        classId: 'e_1',
        moduleId: 'm_3',
        name: 'Week 3',
        position: 2,
      },
    ];

    const query = {
      id: 'e_1',
    };

    await makeHTTPRequest(
      classModulesHandler,
      "/api/class/e_1/modules",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get all modules for another class", async () => {
    const expected: Module[] = [
      {
        classId: 'e_2',
        moduleId: 'm_4',
        name: 'Week 1',
        position: 0,
      },
      {
        classId: 'e_2',
        moduleId: 'm_5',
        name: 'Week 2',
        position: 1,
      },
    ];

    const query = {
      id: 'e_2',
    };

    await makeHTTPRequest(
      classModulesHandler,
      "/api/class/e_2/modules",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get all modules for nonexistent class", async () => {
    const expected = CLASS_NOT_FOUND_ERROR;

    const query = {
      id: 'nonexistent',
    };

    await makeHTTPRequest(
      classModulesHandler,
      "/api/class/nonexistent/modules",
      query,
      "GET",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });
});

describe("[POST] /api/module", () => {
  test("create a class module", async () => {
    const expected: CreateModule = {
      classId: 'e_1',
      name: 'New Class',
      position: 10,
    };

    await makeHTTPRequest(
      createModuleHandler,
      "/api/module",
      undefined,
      "POST",
      expected,
      StatusCodes.CREATED,
      expected,
      "moduleId"
    );
  });

  test("create another class module", async () => {
    const expected: CreateModule = {
      classId: 'e_2',
      name: 'Another new class',
      position: 10,
    };

    await makeHTTPRequest(
      createModuleHandler,
      "/api/module",
      undefined,
      "POST",
      expected,
      StatusCodes.CREATED,
      expected,
      "moduleId"
    );
  });

  test("create class module with invalid body", async () => {
    const expected = {
      invalid: "invalid value"
    }

    await makeHTTPRequest(
      createModuleHandler,
      "/api/module",
      undefined,
      "POST",
      expected,
      StatusCodes.BAD_REQUEST,
      FIELDS_NOT_ENTERED_CORRECTLY,
    );
  });

  test("create module for nonexistent class", async () => {
    const expected: CreateModule = {
      classId: 'nonexistent',
      name: 'Another new class',
      position: 10,
    };

    await makeHTTPRequest(
      createModuleHandler,
      "/api/module",
      undefined,
      "POST",
      expected,
      StatusCodes.NOT_FOUND,
      CLASS_NOT_FOUND_ERROR,
    );
  });
});

describe("[PATCH] /api/module/[id]", () => {
  test("update class module name and position", async () => {
    const expected: Module = {
      classId: 'e_1',
      moduleId: 'm_1',
      name: 'Week 3',
      position: 2,
    };

    const query = {
      id: 'm_1',
    };

    const body = {
      name: 'Week 3',
      position: 2,
    }

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/m_1",
      query,
      "PATCH",
      body,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("update just class module name", async () => {
    const expected: Module = {
      classId: 'e_2',
      moduleId: 'm_4',
      name: 'Week 10',
      position: 0,
    };

    const query = {
      id: 'm_4',
    };

    const body = {
      name: 'Week 10',
    }

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/m_4",
      query,
      "PATCH",
      body,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("update nonexistent module", async () => {
    const expected = MODULE_NOT_FOUND_ERROR;

    const query = {
      id: 'nonexistent',
    };

    const body = {
      name: 'Week 100',
    }

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/nonexistent",
      query,
      "PATCH",
      body,
      StatusCodes.NOT_FOUND,
      expected
    );
  });

  test("update module with invalid request body", async () => {
    const expected = FIELDS_NOT_ENTERED_CORRECTLY;

    const query = {
      id: 'm_1',
    };

    const body = {
      position: "invalid number"
    }

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/m_1",
      query,
      "PATCH",
      body,
      StatusCodes.BAD_REQUEST,
      expected
    );
  });
});

describe("[DELETE] /api/module/[id]", () => {
  test("delete a class module", async () => {
    const expected: Module = {
      classId: 'e_1',
      moduleId: 'm_3',
      name: 'Week 3',
      position: 2,
    };

    const query = {
      id: 'm_3',
    };

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/m_3",
      query,
      "DELETE",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("delete nonexistent class module", async () => {
    const expected = MODULE_NOT_FOUND_ERROR;

    const query = {
      id: 'nonexistent',
    };

    await makeHTTPRequest(
      moduleHandler,
      "/api/module/nonexistent",
      query,
      "DELETE",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });
});
