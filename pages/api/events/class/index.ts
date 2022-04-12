import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  createClassEvent,
  teachersExist,
  NonExistingTeacher,
  TeacherConflictError,
  validateTimes,
} from "../../../../lib/database/events";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";
import { CreateClassEvent, ClassEvent, CreateClassEventSchema } from "../../../../models/events";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { rrulestr } from "rrule";
import { Interval, DateTime } from "luxon";

// handles requests to /api/events/class
const eventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      {
        let newEvent: CreateClassEvent;
        try {
          newEvent = await decode(CreateClassEventSchema, req.body);
        } catch (e) {
          return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
        }
        try {
          // verify the teachers exist in the database
          const teacherIds = await teachersExist(newEvent.teachers);

          const ruleObj = rrulestr(newEvent.rrule);
          const initialDate = ruleObj.all()[0];
          const yearInAdvanceDate = ruleObj.all()[0];
          yearInAdvanceDate.setFullYear(initialDate.getFullYear() + 1);
          // Get all date instances unless never-ending is true, then only get occurences within the first year
          const allDates = newEvent.neverEnding
            ? ruleObj.between(initialDate, yearInAdvanceDate)
            : ruleObj.all();

          // allDates.forEach((d) => { console.log(d) })

          const startTime = DateTime.fromFormat(newEvent.startTime, "HH:mm", {
            zone: newEvent.timeZone,
          });
          const endTime = DateTime.fromFormat(newEvent.endTime, "HH:mm", {
            zone: newEvent.timeZone,
          });

          const intervals: Interval[] = [];

          // Create start-end interval from each date
          for (const date of allDates) {
            const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            const dateStart = DateTime.fromJSDate(dateWithoutTime)
              .set({
                hour: startTime.hour,
                minute: startTime.minute,
                second: startTime.second,
              })
              .setZone(newEvent.timeZone);

            const dateEnd = DateTime.fromJSDate(dateWithoutTime)
              .set({
                hour: endTime.hour,
                minute: endTime.minute,
                second: endTime.second,
              })
              .setZone(newEvent.timeZone);

            intervals.push(Interval.fromDateTimes(dateStart, dateEnd));
          }

          // verify that each teacher is available during class times
          try {
            for (const teacherId of teacherIds) {
              await validateTimes(teacherId, intervals);
            }
          } catch (e) {
            if (e instanceof TeacherConflictError)
              return res.status(StatusCodes.BAD_REQUEST).json(e.message);
            else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
          }

          // create the class event in event_information table
          const result = await createClassEvent(
            newEvent.name,
            newEvent.neverEnding,
            newEvent.backgroundColor
          );

          // insert all date intervals into calendar_information table
          try {
            for (const interval of intervals) {
              await createCalendarEvent(result, interval.start.toISO(), interval.end.toISO());
            }
          } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json("Calendar information is incorrect");
          }

          // Loops through teachers and inserts into commitments table
          try {
            for (const teacher of teacherIds) {
              await createCommitment(teacher, result);
            }
          } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json("Commitment information is incorrect");
          }

          const responseBody: ClassEvent = {
            eventInformationId: result,
            startTime: startTime.toISOTime(),
            endTime: endTime.toISOTime(),
            timeZone: newEvent.timeZone,
            rrule: newEvent.rrule,
            language: newEvent.language,
            neverEnding: newEvent.neverEnding,
            backgroundColor: newEvent.backgroundColor,
          };

          return res.status(StatusCodes.CREATED).json(responseBody);
        } catch (e) {
          if (e instanceof NonExistingTeacher)
            return res.status(StatusCodes.BAD_REQUEST).json(e.message);
          else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
        }
      }
      break;

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default eventHandler;
