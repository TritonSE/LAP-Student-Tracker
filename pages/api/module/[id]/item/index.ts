import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getModule } from "../../../../../lib/database/modules";
import { getModuleItems, createItem } from "../../../../../lib/database/items";
import { CreateItem } from "../../../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import {withLogging} from "../../../../../middleware/withLogging";
import {onError} from "../../../../../logger/logger";

/**
 * @swagger
 * /api/module/{id}/item:
 *  get:
 *    description: get all items for a particular module
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: all items within a particular module
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Item'
 *
 *  post:
 *    description: Create a new item under the module
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: The item to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateItem'
 *    responses:
 *      201:
 *        description: Item created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Item'
 *
 */
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
    onError(e);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  switch (req.method) {
    case "GET": {
      try {
        const modules = await getModuleItems(moduleId);
        return res.status(StatusCodes.ACCEPTED).json(modules);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    case "POST": {
      let newItem: CreateItem;
      try {
        newItem = await decode(CreateItem, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createItem(moduleId, newItem.title, newItem.link);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(itemHandler);
