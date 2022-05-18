import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClass, getAllClasses } from "../../../lib/database/classes";
import { CreateClass, CreateClassSchema } from "../../../models/class";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
//Handles all requests to /api/class

export const classHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let newClass: CreateClass;
  let user_id = "";
  switch (req.method) {
    case "GET":
      if (req.query && req.query.userId) {
        if (req.query.userId != undefined) {
          user_id = req.query.userId as string;
        }
      }
      try {
        let result = await getAllClasses();
        //console.log("zain");
        if (user_id) {
          result = result.filter((obj) =>
            JSON.stringify(obj).toLowerCase().includes(user_id.toLowerCase())
          );
        }
        return res.status(StatusCodes.ACCEPTED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    case "POST":
      try {
        newClass = await decode(CreateClassSchema, req.body);
        //console.log(newClass);
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
