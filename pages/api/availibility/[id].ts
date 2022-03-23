import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { Availibility, AvailibilitySchema } from "../../../models/availibility";
import { getAvailibilityById, updateAvailibility } from "../../../lib/database/availibilities";
import { STATUS_CODES } from "http";
//Handles all requests to /api/class/[id]
export const availibilityIdHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
        const availibility = await getAvailibilityById(id);
        if (availibility == null)
          return res.status(StatusCodes.NOT_FOUND).json("Availibility not found")
        return res.status(StatusCodes.ACCEPTED).json(availibility);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error")
      }

    }
    case "PATCH": {
      // todo: validate if id exists
      let availibility: Availibility;
      if ((await getAvailibilityById(id)) == null)
        return res.status(StatusCodes.NOT_FOUND).json("Availibility for User not found")
      try {
        availibility = await decode(AvailibilitySchema, req.body)
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered")
      }
      try {
        const result = await updateAvailibility(id, availibility.mon, availibility.tue, availibility.wed, availibility.thu, availibility.fri, availibility.sat, availibility.timeZone)
        return res.status(StatusCodes.CREATED).json(result)
      } catch (e) {
        console.log(e)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error")
      }
    }
    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default availibilityIdHandler
