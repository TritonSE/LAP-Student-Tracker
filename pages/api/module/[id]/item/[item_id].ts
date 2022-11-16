import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getModule } from "../../../../../lib/database/modules";
import { getItem, deleteItem, updateItem } from "../../../../../lib/database/items";
import { StatusCodes } from "http-status-codes";
import { withLogging } from "../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../logger/logger";
import { Item, Module } from "../../../../../models";
import { decode } from "io-ts-promise";

/**
 * @swagger
 * /api/module/{id}/item/{itemId}:
 *  delete:
 *    description: delete an item from a module
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: itemId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: Item deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Item'
 */
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
    logData("Item", item);
    if (item == null) {
      return res.status(StatusCodes.NOT_FOUND).json("item not found");
    }
  } catch (e) {
    onError(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  switch (req.method) {
    case "DELETE": {
      try {
        const result = await deleteItem(itemId);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }
    case "PATCH": {
      let item: Item;

      if ((await getItem(itemId)) == null)
        return res.status(StatusCodes.NOT_FOUND).json("Item not found");

      try {
        item = await decode(Item, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = updateItem(itemId, item.title, item.link);
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

export default withLogging(deleteItemHandler);
