import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { Availability } from "../../../models";
// import { Availability, AvailabilitySchema } from "../../../models/availability";
import { getAvailabilityById, updateAvailability } from "../../../lib/database/availability";
import { withAuth } from "../../../middleware/withAuth";
//Handles all requests to /api/availability/[id]
export const availabilityIdHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (!req.query) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json("no id specified");
  }

  switch (req.method) {
    case "GET": {
      try {
        const availability = await getAvailabilityById(id);
        if (availability == null)
          return res.status(StatusCodes.NOT_FOUND).json("Availability of user not found");
        return res.status(StatusCodes.ACCEPTED).json(availability);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }
    case "PATCH": {
      let availability: Availability;
      if ((await getAvailabilityById(id)) == null)
        return res.status(StatusCodes.NOT_FOUND).json("Availability of user not found");
      try {
        availability = await decode(Availability, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await updateAvailability(
          id,
          availability.mon,
          availability.tue,
          availability.wed,
          availability.thu,
          availability.fri,
          availability.sat,
          availability.timeZone
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server CustomError");
      }
    }
    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withAuth(availabilityIdHandler);
