import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { decode } from "io-ts-promise";
import { MakeUpLabEvent } from "../../../../models";
import { CreateMakeUpLabEvent } from "../../../../models";
import { createEvent } from "../../../../lib/database/events";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";

/**
 * @swagger
 * /api/events/lab:
 *  post:
 *    description: Create a new make up lab event
 *    requestBody:
 *      description: Make up lab event to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateMakeUpLabEvent'
 *    responses:
 *      201:
 *        description: Successfully created a new make up lab event
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/MakeUpLabEvent'
 *
 * @param req
 * @param res
 */
const labEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let createMakeUpLabEvent: CreateMakeUpLabEvent;
  switch (req.method) {
    case "POST":
      try {
        createMakeUpLabEvent = await decode(CreateMakeUpLabEvent, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // Add the event into the eventInformation table, getting the event ID in return
        const eventInfoId = await createEvent(
          createMakeUpLabEvent.name,
          false,
          "Make Up Lab",
          createMakeUpLabEvent.color
        );
        // Add the event into the calendarInformation table
        await createCalendarEvent(
          eventInfoId,
          createMakeUpLabEvent.start,
          createMakeUpLabEvent.end
        );
        // Add the teacher and volunteer into the commitments table with the event ID
        await createCommitment(createMakeUpLabEvent.teacher, eventInfoId);
        await createCommitment(createMakeUpLabEvent.student, eventInfoId);
        // Return the InterviewEvent payload
        const makeUpLabEvent: MakeUpLabEvent = {
          eventInformationId: eventInfoId,
          name: createMakeUpLabEvent.name,
          color: createMakeUpLabEvent.color,
          start: createMakeUpLabEvent.start,
          end: createMakeUpLabEvent.end,
        };
        return res.status(StatusCodes.CREATED).json(makeUpLabEvent);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default labEventHandler;
