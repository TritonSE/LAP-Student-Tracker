import itemHandler from "../pages/api/module/[id]/item";
import deleteItemHandler from "../pages/api/module/[id]/item/[item_id]";
import { client } from "../lib/db";
import { makeHTTPRequest } from "./__testutils__/testutils.test";
import { Item, CreateItem } from "../models/items";
import { StatusCodes } from "http-status-codes";

const MODULE_NOT_FOUND_ERROR = "module not found";
const ITEM_NOT_FOUND_ERROR = "item not found";
const FIELDS_NOT_ENTERED_CORRECTLY = "Fields are not correctly entered";

beforeAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
  await client.query("DELETE from module_items");
  await client.query(
    "INSERT INTO event_information(id, name, background_color, type, never_ending) VALUES('e_1', 'CSE 8A', 'blue', 'Class', 'false')"
  );
  await client.query(
    "INSERT INTO classes(event_information_id, min_level, max_level, rrstring, start_time, end_time, language) VALUES('e_1', 3, 5, 'DTSTART:20220222T093000Z\nRRULE:FREQ=WEEKLY;UNTIL=20230222T093000Z;BYDAY=MO,WE,FR;INTERVAL=1', '07:34Z', '08:34Z', 'Python')"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_1', 'e_1', 'Week 1', 0)"
  );
  await client.query(
    "INSERT INTO modules(module_id, class_id, name, position) VALUES('m_2', 'e_1', 'Week 2', 1)"
  );
  await client.query(
    "INSERT INTO module_items(item_id, module_id, title, link) VALUES('i_1', 'm_1', 'Item 1', 'Link 1')"
  );
  await client.query(
    "INSERT INTO module_items(item_id, module_id, title, link) VALUES('i_2', 'm_1', 'Item 2', 'Link 2')"
  );
  await client.query(
    "INSERT INTO module_items(item_id, module_id, title, link) VALUES('i_3', 'm_2', 'Item 1', 'Link 1')"
  );
  await client.query(
    "INSERT INTO module_items(item_id, module_id, title, link) VALUES('i_4', 'm_2', 'Item 2', 'Link 2')"
  );
});

afterAll(async () => {
  await client.query("DELETE from event_information");
  await client.query("DELETE from classes");
  await client.query("DELETE from modules");
  await client.query("DELETE from module_items");
  await client.end();
});

describe("[GET] /api/module/[id]/item", () => {
  test("get all items for a module", async () => {
    const expected: Item[] = [
      {
        moduleId: "m_1",
        itemId: "i_1",
        title: "Item 1",
        link: "Link 1",
      },
      {
        moduleId: "m_1",
        itemId: "i_2",
        title: "Item 2",
        link: "Link 2",
      },
    ];

    const query = {
      id: "m_1",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/m_1/modules",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get all items for another module", async () => {
    const expected: Item[] = [
      {
        moduleId: "m_2",
        itemId: "i_3",
        title: "Item 1",
        link: "Link 1",
      },
      {
        moduleId: "m_2",
        itemId: "i_4",
        title: "Item 2",
        link: "Link 2",
      },
    ];

    const query = {
      id: "m_2",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/m_2/modules",
      query,
      "GET",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("get items for nonexistent module", async () => {
    const expected = MODULE_NOT_FOUND_ERROR;

    const query = {
      id: "nonexistent",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/nonexistent/modules",
      query,
      "GET",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });
});

describe("[POST] /api/module/[id]/item", () => {
  test("create a new module item", async () => {
    const expected = {
      moduleId: "m_1",
      title: "new title",
      link: "new link",
    };

    const body: CreateItem = {
      title: "new title",
      link: "new link",
    };

    const query = {
      id: "m_1",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/m_1/modules",
      query,
      "POST",
      body,
      StatusCodes.CREATED,
      expected,
      "itemId"
    );
  });

  test("create module item with invalid request body", async () => {
    const expected = FIELDS_NOT_ENTERED_CORRECTLY;

    const body = {
      title: "incomplete body",
    };

    const query = {
      id: "m_2",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/m_2/modules",
      query,
      "POST",
      body,
      StatusCodes.BAD_REQUEST,
      expected
    );
  });

  test("create item for nonexistent module", async () => {
    const expected = MODULE_NOT_FOUND_ERROR;

    const query = {
      id: "nonexistent",
    };

    await makeHTTPRequest(
      itemHandler,
      "/api/class/nonexistent/modules",
      query,
      "POST",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });
});

describe("[DELETE] /api/module/[id]/item/[item_id]", () => {
  test("delete a module item", async () => {
    const expected: Item = {
      moduleId: "m_2",
      itemId: "i_4",
      title: "Item 2",
      link: "Link 2",
    };

    const query = {
      id: "m_2",
      item_id: "i_4",
    };

    await makeHTTPRequest(
      deleteItemHandler,
      "/api/module/m_2/item/i_4",
      query,
      "DELETE",
      undefined,
      StatusCodes.ACCEPTED,
      expected
    );
  });

  test("delete an item from nonexistent module", async () => {
    const expected = MODULE_NOT_FOUND_ERROR;

    const query = {
      id: "nonexistent",
      item_id: "i_4",
    };

    await makeHTTPRequest(
      deleteItemHandler,
      "/api/module/nonexistent/item/i_4",
      query,
      "DELETE",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });

  test("delete a nonexistent item from module", async () => {
    const expected = ITEM_NOT_FOUND_ERROR;

    const query = {
      id: "m_2",
      item_id: "nonexistent",
    };

    await makeHTTPRequest(
      deleteItemHandler,
      "/api/module/m_2/item/nonexistent",
      query,
      "DELETE",
      undefined,
      StatusCodes.NOT_FOUND,
      expected
    );
  });
});
