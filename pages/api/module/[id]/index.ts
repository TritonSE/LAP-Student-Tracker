import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getModule, updateModule, deleteModule } from "../../../../lib/database/modules";
import { UpdateModule, UpdateModuleSchema } from "../../../../models/modules";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// Handles all requests to /api/module/[id]
export const moduleHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const moduleId = req.query.id as string;
  if (!moduleId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no module id specified");
  }

  try {
    const moduleObj = await getModule(moduleId);
    if (moduleObj == null) {
      return res.status(StatusCodes.NOT_FOUND).json("module not found");
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  switch (req.method) {
    case "PATCH": {
      let updateModuleObj: UpdateModule;
      try {
        updateModuleObj = await decode(UpdateModuleSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateModule(moduleId, updateModuleObj.name, updateModuleObj.position);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "DELETE": {
      try {
        const result = await deleteModule(moduleId);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default moduleHandler;
