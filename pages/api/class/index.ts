import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClass, getAllClasses } from "../../../lib/database/classes";
import { CreateClass } from "../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { withAuth } from "../../../middleware/withAuth";
//Handles all requests to /api/class

export const classHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let newClass: CreateClass;
  switch (req.method) {
    case "GET":
      try {
        const result = await getAllClasses();
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    case "POST":
      try {
        newClass = await decode(CreateClass, req.body);
      } catch (e) {
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(classHandler);
