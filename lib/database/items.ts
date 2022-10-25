import { client } from "../db";
import { Item } from "../../models";
import { decode } from "io-ts-promise";
import { array } from "io-ts";

const ItemArraySchema = array(Item);

// get all items for a particular module id
const getModuleItems = async (moduleId: string): Promise<Item[]> => {
  const query = {
    text: "SELECT module_id, item_id, title, link FROM module_items WHERE module_id = $1",
    values: [moduleId],
  };

  const res = await client.query(query);

  return await decode(ItemArraySchema, res.rows);
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

  return await decode(Item, res.rows[0]);
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
    throw Error("CustomError on insert into database");
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
    throw Error("CustomError on delete item");
  }

  if (res.rows.length == 0) {
    return null;
  }

  let item: Item;
  try {
    item = await decode(Item, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return item;
};

const updateItem = async (itemId: string, title?: string, link?: string): Promise<Item | null> => {
  const query = {
    text:
      "UPDATE module_items " +
      "SET title = COALESCE($2, title), " +
      "link = COALESCE($3, link) " +
      "WHERE item_id = $1",
    values: [itemId, title, link],
  };

  try {
    await client.query(query);
  } catch (e) {
    console.log(e);
    throw Error("CustomError on update module");
  }

  return getItem(itemId);
};

export { getModuleItems, getItem, createItem, deleteItem, updateItem };
