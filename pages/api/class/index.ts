import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClass, getAllClasses } from "../../../lib/database/classes";
import { CreateClass } from "../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
import { withLogging } from "../../../middleware/withLogging";
import { logData, onError } from "../../../logger/logger";
//Handles all requests to /api/class
/**
 * @swagger
 * /api/class:
 *  get:
 *    description: get a list of all classes in the school
 *    responses:
 *      200:
 *        description: Successfully getting all classes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                $ref: '#/components/schemas/Class'
 *  post:
 *    description: Create a class
 *    requestBody:
 *      description: Data for the class that needs to be created. Name is already store in the db due to the call to the events/class api
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateClass'
 *    responses:
 *      201:
 *        description: Successfully created the class
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Class'
 */
export const classHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let newClass: CreateClass;
  let userId = "";
  switch (req.method) {
    case "GET":
      if (req.query && req.query.userId) {
        if (req.query.userId != undefined) {
          userId = req.query.userId as string;
        }
      }
      try {
        let result = await getAllClasses();
        logData("All Classes", result);

        if (userId) {
          result = result.filter((obj) =>
            JSON.stringify(obj).toLowerCase().includes(userId.toLowerCase())
          );
        }
        logData("All Classes After Filtering By User", result);
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    case "POST":
      try {
        newClass = await decode(CreateClass, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createClass(
          newClass.eventInformationId,
          newClass.minLevel,
          newClass.maxLevel,
          newClass.rrstring,
          newClass.startTime,
          newClass.endTime,
          newClass.language
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(classHandler));
