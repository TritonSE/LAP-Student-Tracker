import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getClass } from "../../../../../lib/database/classes";
import { getClassModules, updateClassModules } from "../../../../../lib/database/modules";
import { StatusCodes } from "http-status-codes";
import { withLogging } from "../../../../../middleware/withLogging";
import { logData, onError } from "../../../../../logger/logger";
import { P } from "pino";
import { decode } from "punycode";
import { Module } from "../../../../../models";
import { STATUS_CODES } from "http";
import { stat } from "fs";

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

        const result = await updateClassModules(classId, new_modules);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        console.log(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    // case "PATCH": {
    //   let newClass: UpdateClass;
    //   if ((await getClass(id)) == null) {
    //     return res.status(StatusCodes.NOT_FOUND).json("class not found");
    //   }

    //   try {
    //     newClass = await decode(UpdateClass, req.body);
    //   } catch (e) {
    //     onError(e);
    //     return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
    //   }
    //   try {
    //     const result = await updateClass(
    //       id,
    //       newClass.minLevel,
    //       newClass.maxLevel,
    //       newClass.rrstring,
    //       newClass.startTime,
    //       newClass.endTime,
    //       newClass.language
    //     );
    //     logData("Class After Update", result);
    //     return res.status(StatusCodes.CREATED).json(result);
    //   } catch (e) {
    //     onError(e);
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
    //   }
    // }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(classModulesHandler);
