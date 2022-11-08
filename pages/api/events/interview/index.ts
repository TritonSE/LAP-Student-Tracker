import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import { decode } from "io-ts-promise";
import { InterviewEvent } from "../../../../models";
import { CreateInterviewEvent } from "../../../../models";
import { createEvent, getTeacherById, NonExistingTeacher, TeacherConflictError, validateTimes } from "../../../../lib/database/events";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";
import { Interval } from "luxon";

/**
 * @swagger
 * /api/events/interview:
 *  post:
 *    description: Create a new interview event
 *    requestBody:
 *      description: Interview event to be created
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateInterviewEvent'
 *    responses:
 *      201:
 *        description: Successfully created a new interview event
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/InterviewEvent'
 *
 * @param req
 * @param res
 */
const interviewEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  let createInterviewEvent: CreateInterviewEvent;
  switch (req.method) {
    case "POST":
      try {
        createInterviewEvent = await decode(CreateInterviewEvent, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // Verify the teacher exists in the database
        const teacher = await getTeacherById(createInterviewEvent.teacher);
        // Verify that teacher doesn't have another event during this interview
        await validateTimes(teacher, [Interval.fromISO(`${createInterviewEvent.start}/${createInterviewEvent.end}`)]);
        // Add the event into the eventInformation table, getting the event ID in return
        const eventInfoId = await createEvent(
          createInterviewEvent.name,
          false,
          "Interview",
          createInterviewEvent.color
        );
        // Add the event into the calendarInformation table
        await createCalendarEvent(
          eventInfoId,
          createInterviewEvent.start,
          createInterviewEvent.end
        );
        // Add the teacher and volunteer into the commitments table with the event ID
        await createCommitment(createInterviewEvent.teacher, eventInfoId);
        await createCommitment(createInterviewEvent.volunteer, eventInfoId);
        // Return the InterviewEvent payload
        const interviewEvent: InterviewEvent = {
          eventInformationId: eventInfoId,
          name: createInterviewEvent.name,
          color: createInterviewEvent.color,
          start: createInterviewEvent.start,
          end: createInterviewEvent.end,
        };
        return res.status(StatusCodes.CREATED).json(interviewEvent);
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

export default interviewEventHandler;
