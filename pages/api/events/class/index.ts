import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { createClassEvent } from "../../../../lib/database/events";
import { createCalenderEvent } from "../../../../lib/database/calender";
import { createCommitment } from "../../../../lib/database/commitments";
import { CreateClassEvent, Event, CreateClassEventSchema, ClassEventSchema } from "../../../../models/events";
import { decode } from "io-ts-promise";
import { StatusCodes } from "http-status-codes";
import { RRule, RRuleSet, rrulestr } from 'rrule'
import { STATUS_CODES } from "http";
import { DateTime } from 'luxon';
import { date } from "fp-ts";

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

        if (result == null) {
          res.status(StatusCodes.NOT_ACCEPTABLE).json("The given teachers do not exist");
        }

        const ruleObj = rrulestr(newEvent.rrule);
        const allDates = newEvent.neverEnding ? ruleObj.all().splice(0, 365) : ruleObj.all();
        const startTime = DateTime.fromISO(newEvent.startTime);
        const endTime = DateTime.fromISO(newEvent.endTime);

        for (const date of allDates) {

          let dateStart = DateTime.fromJSDate(date, { zone: newEvent.timeZone }).set({
            hour: startTime.hour,
            minute: startTime.minute,
            second: startTime.second,
          });

          let dateEnd = DateTime.fromJSDate(date, { zone: newEvent.timeZone }).set({
            hour: endTime.hour,
            minute: endTime.minute,
            second: endTime.second,
          });

          try {
            const calenderResult = await createCalenderEvent(result, dateStart.toISO(), dateEnd.toISO());
          } catch (e) {
            return res.status(StatusCodes.BAD_REQUEST).json("Calender information is incorrect");
          }
        };

        try {
          for (const teacher of newEvent.teachers) {
            const commitmentResult = await createCommitment(teacher, result);
          }
        } catch (e) {
          return res.status(StatusCodes.BAD_REQUEST).json("Commitment information is incorrect");
        }

        return res.status(StatusCodes.CREATED).json({
          "id": result, 
          "startTime": newEvent.startTime, 
          "endTime": newEvent.endTime, 
          "timeZone": newEvent.timeZone,
          "rrule": newEvent.rrule, 
          "language": newEvent.language, 
          "neverEnding": newEvent.neverEnding,
          "backgroundColor": newEvent.backgroundColor, 
          });
      } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Internal Server Error");
      }
      break;

    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json("Method not allowed");
  }
};

export default eventHandler;