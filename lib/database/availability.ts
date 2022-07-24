import { Availability, AvailabilitySchema } from "../../models/availability";
import { client } from "../db";
import { decode } from "io-ts-promise";
import { Interval } from "luxon";
import { User } from "../../models/users";
import { timeDateZoneToDateTime } from "./availability-feed";

type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

class TeacherAvailabilityError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TeacherAvailabilityError.prototype);
  }
}

const updateAvailability = async (
  id: string,
  mon: string[][] | null,
  tue: string[][] | null,
  wed: string[][] | null,
  thu: string[][] | null,
  fri: string[][] | null,
  sat: string[][] | null,
  timeZone: string
): Promise<Availability | null> => {
  const query = {
    text:
      "UPDATE availabilities SET " +
      "mon = $2, " +
      "tue = $3, " +
      "wed = $4, " +
      "thu = $5, " +
      "fri = $6, " +
      "sat = $7, " +
      "time_zone = COALESCE($8, time_zone) " +
      "WHERE user_id = $1",
    values: [id, mon, tue, wed, thu, fri, sat, timeZone],
  };

  try {
    await client.query(query);
  } catch (e) {
    throw Error("CustomError on update availability");
  }

  return getAvailabilityById(id);
};

const getAvailabilityById = async (id: string): Promise<Availability | null> => {
  const query = {
    text: "SELECT mon, tue, wed, thu, fri, sat, time_zone FROM availabilities WHERE user_id = $1",
    values: [id],
  };

  const res = await client.query(query);
  if (res.rows.length == 0) {
    return null;
  }
  let availability: Availability;
  try {
    availability = await decode(AvailabilitySchema, res.rows[0]);
  } catch (e) {
    throw Error("Fields returned incorrectly in database");
  }
  return availability;
};

// verifies that a teacher is available for a recurring event
const validateAvailabilities = async (
  teacher: User,
  intervals: Interval[],
  className: string
): Promise<void> => {
  const availabilities = await getAvailabilityById(teacher.id);
  const indexToWeekdays = ["temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const seenWeekDays = new Set();

  // for each occurence of event
  for (const interval of intervals) {
    const weekday = interval.start.weekday;
    const weekdayStr = indexToWeekdays[weekday] as Weekdays;
    if (weekdayStr == "sun") continue;

    // it is enough to verify first week since availabilities are weekly
    if (seenWeekDays.has(weekday)) break;
    seenWeekDays.add(weekday);

    let isAvailable = false;
    if (availabilities) {
      const availabilityTimes = availabilities[weekdayStr];
      if (availabilityTimes) {
        for (const time of availabilityTimes) {
          // convert availability start and end times to DateTime intervals
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

          // ensure that availability engulfs the event start to end interval
          if (availabilityInterval.engulfs(interval)) {
            isAvailable = true;
            break;
          }
        }
      }
    }

    // if isAvailable flag hasn't been set by this point, teacher isn't available
    if (!isAvailable) {
      throw new TeacherAvailabilityError(
        `Teacher ${teacher.firstName} ${teacher.lastName} is not available for class ${className}`
      );
    }
  }
};

export {
  getAvailabilityById,
  updateAvailability,
  validateAvailabilities,
  TeacherAvailabilityError,
};
