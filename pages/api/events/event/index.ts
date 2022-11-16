import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { decode } from "io-ts-promise";
import { CreateOneOffEvent, OneOffEvent } from "../../../../models";
import {
  createEvent,
  getTeacherById,
  NonExistingTeacher,
  TeacherConflictError,
  validateTimes,
} from "../../../../lib/database/events";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";
import { Interval } from "luxon";

/**
 * @swagger
 * /api/events/event:
 *  post:
 *    description: Create a new one-off event
 *    requestBody:
 *      description: One-off event to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateOneOffEvent'
 *    responses:
 *      201:
 *        description: Successfully created a new one-off event
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/OneOffEvent'
 *
 * @param req
 * @param res
 */
const oneOffEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let createOneOffEvent: CreateOneOffEvent;
  switch (req.method) {
    case "POST":
      try {
        createOneOffEvent = await decode(CreateOneOffEvent, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // Add the event into the eventInformation table, getting the event ID in return
        const eventInfoId = await createEvent(
            createOneOffEvent.name,
            false,
            "One-off Event",
            createOneOffEvent.color
          );
        // We use a for ... of loop here instead of forEach because we want to 
        // break immediately and stop execution if an error occurs.
        for (const attendee of createOneOffEvent.attendees) {
            if (attendee.role === "Teacher") {
                // Verify the teacher exists in the database
                const teacher = await getTeacherById(attendee.userId);
                // Verify that teacher doesn't have another event during this interview
                await validateTimes(teacher, [
                Interval.fromISO(`${createOneOffEvent.start}/${createOneOffEvent.end}`),
                ]);
            }
            // Add the attendee into the commitments table with the event ID
            await createCommitment(attendee.userId, eventInfoId);
        }
        
        // Add the event into the calendarInformation table
        await createCalendarEvent(
          eventInfoId,
          createOneOffEvent.start,
          createOneOffEvent.end
        );
        // Return the OneOffEvent payload
        const oneOffEvent: OneOffEvent = {
          eventInformationId: eventInfoId,
          name: createOneOffEvent.name,
          color: createOneOffEvent.color,
          start: createOneOffEvent.start,
          end: createOneOffEvent.end,
        };
        return res.status(StatusCodes.CREATED).json(oneOffEvent);
      } catch (e) {
        if (e instanceof NonExistingTeacher || e instanceof TeacherConflictError) {
          return res.status(StatusCodes.BAD_REQUEST).json(e.message);
        } else {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
        }
      }
    default:
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
      break;
  }
};

export default oneOffEventHandler;
