import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createModule } from "../../../lib/database/modules";
import { getClass } from "../../../lib/database/classes";
import { CreateModule, CreateModuleSchema } from "../../../models/modules";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// Handles all requests to /api/module
export const createModuleHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "POST": {
      let newModule: CreateModule;
      try {
        newModule = await decode(CreateModuleSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const classObj = await getClass(newModule.classId);
        if (classObj == null) {
          return res.status(StatusCodes.NOT_FOUND).json("class not found");
        }
        const result = await createModule(newModule.classId, newModule.name, newModule.position);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default createModuleHandler;
