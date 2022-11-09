import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createModule } from "../../../lib/database/modules";
import { getClass } from "../../../lib/database/classes";
import { CreateModule } from "../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import {withLogging} from "../../../middleware/withLogging";
import {onError} from "../../../logger/logger";

// Handles all requests to /api/module
/**
 * @swagger
 * /api/module:
 *  post:
 *    description: Add a module to the database
 *    requestBody:
 *      description: The data for the module
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateModule'
 *    responses:
 *      201:
 *        description: Module created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Module'
 *
 *
 */
export const createModuleHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  switch (req.method) {
    case "POST": {
      let newModule: CreateModule;
      try {
        newModule = await decode(CreateModule, req.body);
      } catch (e) {
        onError(e);
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
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(createModuleHandler);
