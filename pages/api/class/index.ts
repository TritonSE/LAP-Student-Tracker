import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClass } from "../../../lib/database/classes";
import { Class, ClassSchema } from "../../../models/class";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

export const classHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
      case "POST":
        let newClass: Class;
        try {
          newClass = await decode(ClassSchema, req.body);
        } catch (e) {
          return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
        }
        try {
          const result = await createClass(
            newClass.id,
            newClass.minLevel,
            newClass.maxLevel,
            newClass.rrstring,
            newClass.timeStart,
            newClass.timeEnd,
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