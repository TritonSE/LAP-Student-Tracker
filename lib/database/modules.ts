import { client } from "../db";
import { Module } from "../../models";
import { decode } from "io-ts-promise";
import { array } from "io-ts";
const ModuleArraySchema = array(Module);
// get all modules for a particular class id
const getClassModules = async (classId: string): Promise<Module[]> => {
  const query = {
    text: "SELECT class_id, module_id, name, position FROM modules WHERE class_id = $1",
    values: [classId],
  };

  const res = await client.query(query);
  return await decode(ModuleArraySchema, res.rows);
};

// get module from database by module_id
const getModule = async (moduleId: string): Promise<Module | null> => {
  const query = {
    text: "SELECT class_id, module_id, name, position FROM modules WHERE module_id = $1",
    values: [moduleId],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  return await decode(Module, res.rows[0]);
};

// create a module with the given parameters
const createModule = async (
  classId: string,
  name: string,
  position: number
): Promise<Module | null> => {
  const query = {
    text: "INSERT INTO modules(class_id, name, position) VALUES($1, $2, $3) RETURNING module_id",
    values: [classId, name, position],
  };

  const res = await client.query(query);

  return getModule(res.rows[0].moduleId);
};

// updates module with the given parameters
const updateModule = async (
  moduleId: string,
  name?: string,
  position?: number
): Promise<Module | null> => {
  const query = {
    text:
      "UPDATE modules " +
      "SET name = COALESCE($2, name), " +
      "position = COALESCE($3, position) " +
      "WHERE module_id = $1",
    values: [moduleId, name, position],
  };

  await client.query(query);

  return getModule(moduleId);
};

// deletes module by module_id
const deleteModule = async (moduleId: string): Promise<Module | null> => {
  const query = {
    text: "DELETE FROM modules WHERE module_id = $1 RETURNING *",
    values: [moduleId],
  };

  const res = await client.query(query);

  if (res.rows.length == 0) {
    return null;
  }

  return await decode(Module, res.rows[0]);
};

export { getClassModules, updateClassModules, getModule, createModule, updateModule, deleteModule };
