import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { AvailibilitySchema } from "../../../models/availibility";
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
      console.log("GET")
      return;
    }
    case "POST": {
      console.log("PATCH")
      return;
    }
    case "PATCH": {
      console.log("PATCH")
      return;
    }
    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }



};
