import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { updateClass } from "../../../lib/database/classes";
import {UpdateClassSchema, UpdateClass } from "../../../models/class";
import { decode } from "io-ts-promise";
import { getClass } from "../../../lib/database/classes";
import { StatusCodes } from "http-status-codes";


export const classIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json("no id specified");
  }

  switch (req.method) {
    case "GET":
      try {
        const get_class = await getClass(id);
        if (get_class == null) {
          return res.status(StatusCodes.NOT_FOUND).json("class not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(get_class);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    case "PATCH":
      let patch_class = await getClass(id);
      
      if (patch_class == null) {
        return res.status(StatusCodes.NOT_FOUND).json("class not found");
      }
      let new_class;
      try {

        new_class = await decode(UpdateClassSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {

        const result = await updateClass(
          id,
          new_class.minLevel,
          new_class.maxLevel,
          new_class.rrstring,
          new_class.startTime,
          new_class.endTime,
          new_class.language
        );

        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
          
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default classIDHandler;
