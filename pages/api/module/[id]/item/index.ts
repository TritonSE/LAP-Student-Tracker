import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getModule } from "../../../../../lib/database/modules";
import { getModuleItems, createItem } from "../../../../../lib/database/items";
import { CreateItem, CreateItemSchema } from "../../../../../models/items";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// Handles all requests to /api/module/[id]/item
export const itemHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
    case "GET": {
      try {
        const modules = await getModuleItems(moduleId);
        return res.status(StatusCodes.ACCEPTED).json(modules);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "POST": {
      let newItem: CreateItem;
      try {
        newItem = await decode(CreateItemSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createItem(moduleId, newItem.title, newItem.link);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default itemHandler;
