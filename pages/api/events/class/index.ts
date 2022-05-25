import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import {
  createClassEvent,
  NonExistingTeacher,
  TeacherConflictError,
  teachersExist,
  validateTimes,
} from "../../../../lib/database/events";
import { getAvailabilityById } from "../../../../lib/database/availability";
import { timeDateZoneToDateTime } from "../../../../lib/database/availability-feed";
import { createCalendarEvent } from "../../../../lib/database/calendar";
import { createCommitment } from "../../../../lib/database/commitments";
import { ClassEvent, CreateClassEvent, CreateClassEventSchema } from "../../../../models/events";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { rrulestr } from "rrule";
import { DateTime, Interval } from "luxon";
import { withAuth } from "../../../../middleware/withAuth";

type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type WeekdayIntervals = {
  mon: Interval | null;
  tue: Interval | null;
  wed: Interval | null;
  thu: Interval | null;
  fri: Interval | null;
  sat: Interval | null;
};

class TeacherAvailabilityError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TeacherAvailabilityError.prototype);
  }
}

// handles requests to /api/events/class
const classEventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      let newEvent: CreateClassEvent;
      try {
        newEvent = await decode(CreateClassEventSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        // verify the teachers exist in the database
        const teachers = await teachersExist(newEvent.teachers);

        const ruleObj = rrulestr(newEvent.rrule);
        const initialDate = ruleObj.all()[0];
        const yearInAdvanceDate = ruleObj.all()[0];
        yearInAdvanceDate.setFullYear(initialDate.getFullYear() + 1);
        // Get all date instances unless never-ending is true, then only get occurrences within the first year
        const allDates = newEvent.neverEnding
          ? ruleObj.between(initialDate, yearInAdvanceDate)
          : ruleObj.all();

        const startTime = DateTime.fromFormat(newEvent.startTime, "HH:mm", {
          zone: newEvent.timeZone,
        });
        const endTime = DateTime.fromFormat(newEvent.endTime, "HH:mm", {
          zone: newEvent.timeZone,
        });

        const intervals: Interval[] = [];
        const intervalsByWeekDay: WeekdayIntervals = {
          mon: null,
          tue: null,
          wed: null,
          thu: null,
          fri: null,
          sat: null,
        };

        const indexToWeekdays = ["temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        const seenWeekDays = new Set();

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

          const interval = Interval.fromDateTimes(dateStart, dateEnd);
          intervals.push(interval);

          const weekDay = dateStart.weekday;
          if (!seenWeekDays.has(weekDay)) {
            seenWeekDays.add(weekDay);
            const weekDayStr = indexToWeekdays[weekDay] as Weekdays;
            if (weekDayStr != "sun") {
              intervalsByWeekDay[weekDayStr] = interval;
            }
          }
        }

        // verify scheduling for each teacher
        try {
          for (const teacher of teachers) {
            // verify that teacher doesn't have another event during this class
            await validateTimes(teacher, intervals);

            // verify that teacher has availability set during this class time
            if (newEvent.checkAvailabilities) {
              const availabilities = await getAvailabilityById(teacher.id);
              let weekday: keyof WeekdayIntervals;
              for (weekday in intervalsByWeekDay) {
                const interval = intervalsByWeekDay[weekday];
                let isAvailable = false;
                if (availabilities && interval) {
                  const availabilityTimes = availabilities[weekday];
                  if (availabilityTimes) {
                    for (const time of availabilityTimes) {
                      const availableStartDateTime = timeDateZoneToDateTime(
                        time[0],
                        interval.start,
                        availabilities.timeZone
                      );
                      const availableEndDateTime = timeDateZoneToDateTime(
                        time[1],
                        interval.start,
                        availabilities.timeZone
                      );
                      const availabilityInterval = Interval.fromDateTimes(
                        availableStartDateTime,
                        availableEndDateTime
                      );
                      if (availabilityInterval.engulfs(interval)) {
                        isAvailable = true;
                        break;
                      }
                    }
                  }
                }
                if (interval && !isAvailable) {
                  throw new TeacherAvailabilityError(
                    `Teacher ${teacher.firstName} ${teacher.lastName} is not available for class ${newEvent.name}`
                  );
                }
              }
            }
          }
        } catch (e) {
          if (e instanceof TeacherConflictError)
            return res.status(StatusCodes.BAD_REQUEST).json(e.message);
          else if (e instanceof TeacherAvailabilityError) {
            return res.status(StatusCodes.BAD_REQUEST).json(e.message);
          } else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
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
          for (const teacher of teachers) {
            await createCommitment(teacher.id, result);
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
        else return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal server error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default withAuth(classEventHandler);
