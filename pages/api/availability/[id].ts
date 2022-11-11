import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { Availability } from "../../../models";
import { getAvailabilityById, updateAvailability } from "../../../lib/database/availability";
import { withAuth } from "../../../middleware/withAuth";
import { withLogging } from "../../../middleware/withLogging";
import { logData, onError } from "../../../logger/logger";

/**
 * @swagger
 * /api/availability/{id}:
 *  get:
 *    description: Get the availability for a given teacher
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      202:
 *        description: Availability returned sucesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Availability'
 *  patch:
 *    description: Update the availability of a teacher
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      description: The new availability for the teacher
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Availability'
 *    responses:
 *      201:
 *        description: Availability updated sucesfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Availability'
 */
export const availabilityIdHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
        const availability = await getAvailabilityById(id);
        logData("Availability", availability);
        if (availability == null)
          return res.status(StatusCodes.NOT_FOUND).json("Availability of user not found");
        return res.status(StatusCodes.ACCEPTED).json(availability);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }
    case "PATCH": {
      let availability: Availability;
      if ((await getAvailabilityById(id)) == null)
        return res.status(StatusCodes.NOT_FOUND).json("Availability of user not found");
      try {
        availability = await decode(Availability, req.body);
      } catch (e) {
        onError(e);
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
        logData("Updated Availability", availability);
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }
    default: {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
    }
  }
};

export default withLogging(withAuth(availabilityIdHandler));
