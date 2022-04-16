import {DateTime, Interval} from "luxon";
import {CalendarEvent} from "../../models/events";
import {getAvailabilityById} from "./availability";
import {getEventFeed} from "./calendar-events";
import {getUser} from "./users";
import ColorHash from "color-hash";

const indexToWeekdays = ["temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const hash = new ColorHash();

type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// get all DateTime days between an interval (start < end)
const getDatesInInterval = (start: string, end: string): DateTime[] => {
  const interval = Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end));
  const dates = [];
  let cursor = interval.start.startOf("day");
  while (cursor < interval.end) {
    dates.push(cursor);
    cursor = cursor.plus({ days: 1 });
  }
  return dates;
};

// get DateTime in specified timezone given "HH:mm" time and JS date
const getDateTime = (time: string, date: Date, timeZone: string): DateTime => {
  return DateTime.fromFormat(time, "HH:mm")
    .set({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    })
    .setZone(timeZone);
};

/**
 * given interval defined as a length 2 array of times in "HH:mm" format, a JS Date, and a timeZone, return
 * a length 2 array representing the same interval but with datetimes (with the correct date and timezone)
 */

const insertDateIntoInterval = (interval: string[], date: Date, timeZone: string): DateTime[] => {
  return [getDateTime(interval[0], date, timeZone), getDateTime(interval[1], date, timeZone)];
};

/**
 * Given a start and end DateTime, as well as an array of intervals, this function returns
 * an array of intervals representing all the times in between start and end that were not in
 * the passed in intervals array
 *
 * Think of this as the "not" operator being applied to the passed in intervals (getting the opposite of all intervals)
 *
 * Note: The intervals array MUST be sorted for this to work
 */
const calculateBetweenIntervals = (
  start: DateTime,
  end: DateTime,
  intervals: Interval[]
): Interval[] => {
  if (intervals.length == 0) {
    return [Interval.fromDateTimes(start, end)];
  }

  const newIntervals = intervals.map((interval, index) => {
    if (index == 0) return Interval.fromDateTimes(start, interval.start);
    return Interval.fromDateTimes(intervals[index - 1].end, interval.start);
  });
  newIntervals.push(Interval.fromDateTimes(intervals[intervals.length - 1].end, end));
  return newIntervals.filter(
    (interval) => interval.length("milliseconds") != 0 && interval.isValid
  );
};

/**
 * The function does as follows:
 * Gets availabilities and inserts the correct date into them
 * Gets all commitments the user is assigned to
 * Calculate unavailability from availabilities
 * Merge unavailability with commitments
 * Calculate availability be revering the merged unavailability and commitments and return
 */
const getAvailabilityFeed = async (
  start: string,
  end: string,
  userId: string
): Promise<CalendarEvent[]> => {
  const dates = getDatesInInterval(start, end);
  const user = await getUser(userId);
  if (user == null) {
    throw Error("Could not retrieve user from database");
  }
  const availibility = await getAvailabilityById(userId);
  if (availibility == null) {
    throw Error("Could not fetch availibility for user");
  }
  const availabilityAsIntervals: Interval[] = [];
  const processedDaysOfWeek = new Set<string>();
  dates.forEach((date) => {
    const weekdayStr = indexToWeekdays[date.weekday] as Weekdays;
    if (processedDaysOfWeek.has(weekdayStr) || weekdayStr == "sun") return;

    processedDaysOfWeek.add(weekdayStr);
    let availabilitiesToProcess = availibility[weekdayStr] == null ? [] : availibility[weekdayStr];
    if (availabilitiesToProcess == null) availabilitiesToProcess = [];
    availabilitiesToProcess.forEach((availabilityInterval) => {
      const availabilityWithDate = insertDateIntoInterval(
        availabilityInterval,
        date.toJSDate(),
        availibility.timeZone
      );
      availabilityAsIntervals.push(
        Interval.fromDateTimes(availabilityWithDate[0], availabilityWithDate[1])
      );
    });
  });
  // custom comparator for sorting
  const compare = (a: Interval, b: Interval): number => {return a.start >= b.start ? 1 : -1;}
  // sort intervals in ascending order by start time
  const sortedAvailabilityAsIntervals = availabilityAsIntervals.sort( (a: Interval, b: Interval) => { return compare(a, b) });

  const unavailability = calculateBetweenIntervals(
    DateTime.fromISO(start),
    DateTime.fromISO(end),
      sortedAvailabilityAsIntervals
  );
  const userEvents = (await getEventFeed(start, end, userId)).map((event) => {
    return Interval.fromDateTimes(DateTime.fromISO(event.start), DateTime.fromISO(event.end));
  });

  const completeUnavailability = unavailability.concat(userEvents);

  const mergedUnavailability = Interval.merge(completeUnavailability);

  const sortedMergedUnavailability = mergedUnavailability.sort( (a: Interval, b: Interval) => { return compare(a, b) });

  const finalAvailability = calculateBetweenIntervals(
    DateTime.fromISO(start),
    DateTime.fromISO(end), sortedMergedUnavailability
  );

  return finalAvailability.map((interval) => {
    return {
      id: user.id,
      backgroundColor: hash.hex(user.firstName + " " + user.lastName) as string,
      title: user.firstName + " " + user.lastName + " is Available",
      start: interval.start.toISO(),
      end: interval.end.toISO(),
    };
  });
};

export { getAvailabilityFeed };
