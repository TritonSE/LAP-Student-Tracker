import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClassEvent } from "../../../../lib/database/events";
import { CreateClassEvent, Event, CreateClassEventSchema, ClassEventSchema } from "../../../../models/events";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";

// handles requests to /api/events/class
export const eventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      let newEvent: CreateClassEvent;
      try {
        newEvent = await decode(CreateClassEventSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createClassEvent(
          newEvent.name,
          newEvent.startTime,
          newEvent.endTime,
          newEvent.timeZone,
          newEvent.rrule,
          newEvent.language,
          newEvent.neverEnding,
          newEvent.backgroundColor,
          newEvent.teachers
        );
        return res.status(StatusCodes.CREATED).json(result);
      } catch (e) {
        console.log(e);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
      break;

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default eventHandler;