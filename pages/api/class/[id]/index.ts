import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { updateClass } from "../../../../lib/database/classes";
import { UpdateClass, UpdateClassSchema } from "../../../../models/class";
import { decode } from "io-ts-promise";
import { getClass } from "../../../../lib/database/classes";
import { StatusCodes } from "http-status-codes";
//Handles all requests to /api/class/[id]
export const classIDHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json("no id specified");
  }
  switch (req.method) {
    case "GET": {
      try {
        const classes = await getClass(id);
        if (classes == null) {
          return res.status(StatusCodes.NOT_FOUND).json("class not found");
        }
        return res.status(StatusCodes.ACCEPTED).json(classes);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    case "PATCH": {
      let newClass: UpdateClass;
      if ((await getClass(id)) == null) {
        return res.status(StatusCodes.NOT_FOUND).json("class not found");
      }

      try {
        newClass = await decode(UpdateClassSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateClass(
          id,
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
    }

    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default classIDHandler;
