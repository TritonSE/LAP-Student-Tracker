import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getClass } from "../../../../../lib/database/classes";
import {
  getClassModules,
  updateClassModules,
  updateModule,
} from "../../../../../lib/database/modules";
import { StatusCodes } from "http-status-codes";
import { withLogging } from "../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../logger/logger";
import { Module } from "../../../../../models";

/**
 * @swagger
 * /api/class/{id}/modules:
 *  get:
 *    description: Get all modules for a specific class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Getting all modules for this class
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Module'
 *  patch:
 *    description: Update the modules in a class
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      modules: all the new modules for a class
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Module'
 *    responses:
 *      201:
 *        description: Modules updated sucesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Module'
 */
export const classModulesHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const classId = req.query.id as string;
  if (!classId) {
    return res.status(StatusCodes.BAD_REQUEST).json("no class id specified");
  }
  switch (req.method) {
    case "GET": {
      try {
        const classObj = await getClass(classId);
        if (classObj == null) {
          return res.status(StatusCodes.NOT_FOUND).json("class not found");
        }
        const modules = await getClassModules(classId);
        logData("Modules", modules);
        return res.status(StatusCodes.ACCEPTED).json(modules);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "PATCH": {
      try {
        const classObj = await getClass(classId);
        if (classObj == null) {
          return res.status(StatusCodes.NOT_FOUND).json("Class Not Found");
        }
        let new_modules: Module[];
        try {
          new_modules = req.body;

          if (new_modules == null) {
            return res.status(StatusCodes.BAD_REQUEST).json("Invalid Request");
          }
        } catch (e) {
          return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
        }

        let updated_modules: Module[] = [];
        await new_modules.map(async (module) => {
          const curr_mod = await updateModule(module.name, undefined, module.position);
          console.log(curr_mod);
          if (curr_mod) {
            updated_modules.push(curr_mod);
          }
        });

        console.log("updated:", updated_modules);

        return res.status(StatusCodes.ACCEPTED).json(updated_modules);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(classModulesHandler);
