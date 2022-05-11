import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getModule } from "../../../../../lib/database/modules";
import { getItem, deleteItem } from "../../../../../lib/database/items";
import { StatusCodes } from "http-status-codes";

// Handles all requests to /api/module/[id]/item/[item_id]
export const deleteItemHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const moduleId = req.query.id as string;
  if (!moduleId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no module id specified");
  }
  const itemId = req.query.item_id as string;
  if (!itemId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no item id specified");
  }

  try {
    const moduleObj = await getModule(moduleId);
    if (moduleObj == null) {
      return res.status(StatusCodes.NOT_FOUND).json("module not found");
    }

    const item = await getItem(itemId);
    if (item == null) {
      return res.status(StatusCodes.NOT_FOUND).json("item not found");
    }
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const result = await deleteItem(itemId);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default deleteItemHandler;
