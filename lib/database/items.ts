import { client } from "../db";
import { Item, ItemArraySchema, ItemSchema } from "../../models/items";
import { decode } from "io-ts-promise";

// get all items for a particular module id
const getModuleItems = async (moduleId: string): Promise<Item[]> => {
  const query = {
    text: "SELECT module_id, item_id, title, link FROM module_items WHERE module_id = $1",
    values: [moduleId],
  };

  const res = await client.query(query);

  let moduleItems: Item[];
  try {
    moduleItems = await decode(ItemArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return moduleItems;
};

// get item from database by item_id
const getItem = async (itemId: string): Promise<Item | null> => {
  const query = {
    text: "SELECT module_id, item_id, title, link FROM module_items WHERE item_id = $1",
    values: [itemId],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  let item: Item;
  try {
    item = await decode(ItemSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return item;
};

// create a module item with the given parameters
const createItem = async (moduleId: string, title: string, link: string): Promise<Item | null> => {
  const query = {
    text: "INSERT INTO module_items(module_id, title, link) VALUES($1, $2, $3) RETURNING item_id",
    values: [moduleId, title, link],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database");
  }

  return getItem(res.rows[0].itemId);
};

// deletes module item by item_id
const deleteItem = async (itemId: string): Promise<Item | null> => {
  const query = {
    text: "DELETE FROM module_items WHERE item_id = $1 RETURNING *",
    values: [itemId],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on delete item");
  }

  if (res.rows.length == 0) {
    return null;
  }

  let item: Item;
  try {
    item = await decode(ItemSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return item;
};

export { getModuleItems, getItem, createItem, deleteItem };
