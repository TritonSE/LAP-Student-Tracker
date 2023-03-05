import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  createClassEvent,
  NonExistingTeacher,
  TeacherConflictError,
  teachersExist,
  validateTimes,
} from "../../../../lib/database/events";
import {
  TeacherAvailabilityError,
  validateAvailabilities,
} from "../../../../lib/database/availability";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";
import { ClassEvent, CreateClassEvent } from "../../../../models";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { rrulestr } from "rrule";
import { DateTime, Interval } from "luxon";
import { withAuth } from "../../../../middleware/withAuth";
import { withLogging } from "../../../../middleware/withLogging";
import { logData, logger, onError } from "../../../../logger/logger";

/**
 * @swagger
 * /events/class:
 *  post:
 *    description: Create a new class event (this api will generate events for the calendar). Has validation to ensure teachers are not double booked
 *    requestBody:
 *      description: The data for the new class
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/CreateClassEvent'
 *    responses:
 *      201:
 *        description: Class created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/ClassEvent'
 * @param req
 * @param res
 */
const classEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      let newEvent: CreateClassEvent;
      try {
        newEvent = await decode(CreateClassEvent, req.body);
      } catch (e) {
        onError(e);
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // verify the teachers exist in the database
        const teachers = await teachersExist(newEvent.teachers);
        logData("Teachers For Creating Class", teachers);

        const ruleObj = rrulestr(newEvent.rrule);

        // Get all date instances unless never-ending is true, then only get the first 20 occurrences
        const allDates = newEvent.neverEnding ? ruleObj.all((_, idx) => idx < 20) : ruleObj.all();

        const initialDate = allDates[0];
        logger.info("Initial Date: " + initialDate.toDateString());

        logger.info("End Date: " + allDates[allDates.length - 1].toDateString());

        const startTime = DateTime.fromFormat(newEvent.startTime, "HH:mm", {
          zone: newEvent.timeZone,
        });

        logger.info("Start Time: " + startTime.toISOTime());
        const endTime = DateTime.fromFormat(newEvent.endTime, "HH:mm", {
          zone: newEvent.timeZone,
        });

        logger.info("End Time: " + endTime.toISOTime());

        const intervals: Interval[] = [];

        for (const date of allDates) {
          const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

          const dateStart = DateTime.fromJSDate(dateWithoutTime)
            .set({
              hour: startTime.hour,
              minute: startTime.minute,
              second: startTime.second,
            })
            .setZone(newEvent.timeZone, { keepLocalTime: true });

          const dateEnd = DateTime.fromJSDate(dateWithoutTime)
            .set({
              hour: endTime.hour,
              minute: endTime.minute,
              second: endTime.second,
            })
            .setZone(newEvent.timeZone, { keepLocalTime: true });

          intervals.push(Interval.fromDateTimes(dateStart, dateEnd));
        }

        const validateTimesPromises: Promise<void>[] = [];
        // verify scheduling for each teacher
        try {
          for (const teacher of teachers) {
            // verify that teacher doesn't have another event during this class
            validateTimesPromises.push(validateTimes(teacher, intervals));

            // verify that teacher has availability set during this class time
            if (newEvent.checkAvailabilities) {
              validateTimesPromises.push(validateAvailabilities(teacher, intervals, newEvent.name));
            }
          }
          await Promise.all(validateTimesPromises);
        } catch (e) {
          onError(e);
          if (e instanceof TeacherConflictError)
            return res.status(StatusCodes.BAD_REQUEST).json(e.message);
          else if (e instanceof TeacherAvailabilityError) {
            return res.status(StatusCodes.BAD_REQUEST).json(e.message);
          } else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
        }

        // create the class event in event_information table
        const eventInformationId = await createClassEvent(
          newEvent.name,
          newEvent.neverEnding,
          newEvent.backgroundColor
        );

        logData("Class Event", eventInformationId);

        const calenderInformationInsertPromises: Promise<void>[] = [];
        // insert all date intervals into calendar_information table
        try {
          for (const interval of intervals) {
            calenderInformationInsertPromises.push(
              createCalendarEvent(eventInformationId, interval.start.toISO(), interval.end.toISO())
            );
          }
          await Promise.all(calenderInformationInsertPromises);
        } catch (e) {
          onError(e);
          return res.status(StatusCodes.BAD_REQUEST).json("Calendar information is incorrect");
        }

        // Loops through teachers and inserts into commitments table
        const commitmentPromises: Promise<void>[] = [];
        try {
          for (const teacher of teachers) {
            commitmentPromises.push(createCommitment(teacher.id, eventInformationId));
          }

          for (const studentId of newEvent.studentIds) {
            commitmentPromises.push(createCommitment(studentId, eventInformationId));
          }

          for (const volunteerId of newEvent.volunteerIds) {
            commitmentPromises.push(createCommitment(volunteerId, eventInformationId));
          }

          await Promise.all(commitmentPromises);
        } catch (e) {
          onError(e);
          return res.status(StatusCodes.BAD_REQUEST).json("Commitment information is incorrect");
        }

        const responseBody: ClassEvent = {
          eventInformationId: eventInformationId,
          startTime: startTime.toISOTime(),
          endTime: endTime.toISOTime(),
          timeZone: newEvent.timeZone,
          rrule: newEvent.rrule,
          language: newEvent.language,
          neverEnding: newEvent.neverEnding,
          backgroundColor: newEvent.backgroundColor,
        };

        logData("Create Class Response", responseBody);

        return res.status(StatusCodes.CREATED).json(responseBody);
      } catch (e) {
        onError(e);
        if (e instanceof NonExistingTeacher)
          return res.status(StatusCodes.BAD_REQUEST).json(e.message);
        else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withLogging(withAuth(classEventHandler));
