import { client } from "../db";
import { Module, ModuleArraySchema, ModuleSchema } from "../../models/modules";
import { decode } from "io-ts-promise";

// get all modules for a particular class id
const getClassModules = async (classId: string): Promise<Module[]> => {
  const query = {
    text: "SELECT class_id, module_id, name, position FROM modules WHERE class_id = $1",
    values: [classId],
  };

  const res = await client.query(query);

  let classModules: Module[];
  try {
    classModules = await decode(ModuleArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return classModules;
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

  let classModule: Module;
  try {
    classModule = await decode(ModuleSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return classModule;
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

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on insert into database");
  }

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
      "WHERE module_id=$1",
    values: [moduleId, name, position],
  };

  try {
    await client.query(query);
  } catch (e) {
    throw Error("Error on update module");
  }

  return getModule(moduleId);
};

// deletes module by module_id
const deleteModule = async (moduleId: string): Promise<Module | null> => {
  const query = {
    text: "DELETE FROM modules WHERE module_id = $1 RETURNING *",
    values: [moduleId],
  };

  let res;
  try {
    res = await client.query(query);
  } catch (e) {
    throw Error("Error on delete module");
  }

  if (res.rows.length == 0) {
    return null;
  }

  let deletedModule: Module;
  try {
    deletedModule = await decode(ModuleSchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }

  return deletedModule;
};

export { getClassModules, getModule, createModule, updateModule, deleteModule };
