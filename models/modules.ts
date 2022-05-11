import * as t from "io-ts";

export const ModuleSchema = t.type({
  classId: t.string,
  moduleId: t.string,
  name: t.string,
  position: t.number,
});

export const CreateModuleSchema = t.type({
  classId: t.string,
  name: t.string,
  position: t.number,
});

export const UpdateModuleSchema = t.partial({
  name: t.string,
  position: t.number,
});

export const ModuleArraySchema = t.array(ModuleSchema);

export type Module = t.TypeOf<typeof ModuleSchema>;
export type CreateModule = t.TypeOf<typeof CreateModuleSchema>;
export type UpdateModule = t.TypeOf<typeof UpdateModuleSchema>;