import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClass } from "../../../lib/database/classes";
import { Class, ClassSchema } from "../../../models/class";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

export const classHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let newClass: Class;
  switch (req.method) {
    case "POST":
      try {
        newClass = await decode(ClassSchema, req.body);
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default classHandler;
