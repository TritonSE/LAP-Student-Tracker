import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClassEvent } from "../../../../lib/database/events";
import { createCalenderEvent } from "../../../../lib/database/calender";
import { createCommitment } from "../../../../lib/database/commitments";
import { CreateClassEvent, ClassEvent, CreateClassEventSchema } from "../../../../models/events";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { rrulestr } from "rrule";
import { DateTime } from "luxon";

// handles requests to /api/events/class
const eventHandler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST": {
      let newEvent: CreateClassEvent;
      try {
        newEvent = await decode(CreateClassEventSchema, req.body);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).json("Fields are not correctly entered");
      }
      try {
        const result = await createClassEvent(
          newEvent.name,
          newEvent.neverEnding,
          newEvent.backgroundColor,
          newEvent.teachers
        );

        const ruleObj = rrulestr(newEvent.rrule);
        const initialDate = ruleObj.all()[0];
        const yearInAdvanceDate = ruleObj.all()[0];
        yearInAdvanceDate.setFullYear(initialDate.getFullYear() + 1);
        const allDates = newEvent.neverEnding
          ? ruleObj.between(initialDate, yearInAdvanceDate)
          : ruleObj.all();
        const startTime = DateTime.fromFormat(newEvent.startTime, "HH:mm");
        const endTime = DateTime.fromFormat(newEvent.endTime, "HH:mm");

        // Loops through all dates and inserts into calender_information table
        for (const date of allDates) {
          const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          const dateStart = DateTime.fromJSDate(dateWithoutTime, { zone: newEvent.timeZone }).set({
            hour: startTime.hour,
            minute: startTime.minute,
            second: startTime.second,
          });

          const dateEnd = DateTime.fromJSDate(dateWithoutTime, { zone: newEvent.timeZone }).set({
            hour: endTime.hour,
            minute: endTime.minute,
            second: endTime.second,
          });

          try {
            await createCalenderEvent(result.classEventId, dateStart.toISO(), dateEnd.toISO());
          } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json("Calender information is incorrect");
          }
        }

        // Loops through teachers and inserts into commitments table
        try {
          for (const teacher of result.teacherIds) {
            await createCommitment(teacher, result.classEventId);
          }
        } catch (e) {
          return res.status(StatusCodes.BAD_REQUEST).json("Commitment information is incorrect");
        }

        const responseBody: ClassEvent = {
          eventInformationId: result.classEventId,
          startTime: startTime.setZone(newEvent.timeZone).toISOTime(),
          endTime: endTime.setZone(newEvent.timeZone).toISOTime(),
          timeZone: newEvent.timeZone,
          rrule: newEvent.rrule,
          language: newEvent.language,
          neverEnding: newEvent.neverEnding,
          backgroundColor: newEvent.backgroundColor,
        };

        return res.status(StatusCodes.CREATED).json(responseBody);
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
    }

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default eventHandler;
