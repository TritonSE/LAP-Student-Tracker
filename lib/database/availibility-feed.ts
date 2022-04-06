import { Interval, DateTime } from "luxon";
import { CalendarEvent } from "../../models/events";
import { getAvailibilityById } from "./availibilities";
import { getEventFeed } from "./calendar-events";
import { getUser } from "./users";
import ColorHash from "color-hash";

const indexToWeekdays = ["temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const hash = new ColorHash();

type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

// get all DateTime days inbetween an interval (start < end)
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

/* given interval defined as a length 2 array of times in "HH:mm" format, a JS Date, and a timeZone, return
   a length 2 array representing the same interval but with datetimes (with the correct date and timezone)
*/
const insertDateIntoInterval = (interval: string[], date: Date, timeZone: string): DateTime[] => {
  return [getDateTime(interval[0], date, timeZone), getDateTime(interval[1], date, timeZone)];
};

/**
 * Given a start and end DateTime, as well as an array of intervals, this function returns
 * an array of intervals representing all the times in between start and end that were not in
 * the passed in intervals array
 *
 * Think of this as the "not" operator being applied to the passed in intervals (getting the oppositve of all intervals)
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

// get all intervals with dates
// calculate unavailibilities
// use merge from luxon on unavaibililites and events
// reverse unavailibilities

const getAvailibilityFeed = async (
  start: string,
  end: string,
  userId: string
): Promise<CalendarEvent[]> => {
  const dates = getDatesInInterval(start, end);
  const user = await getUser(userId);
  if (user == null) {
    throw Error("Could not retrieve user from database");
  }
  const availibility = await getAvailibilityById(userId);
  if (availibility == null) {
    throw Error("Could not fetch availibility for user");
  }
  const availibilityAsIntervals: Interval[] = [];
  const processedDaysOfWeek = new Set<string>();
  dates.forEach((date) => {
    const weekdayStr = indexToWeekdays[date.weekday] as Weekdays;
    if (processedDaysOfWeek.has(weekdayStr) || weekdayStr == "sun") return;

    processedDaysOfWeek.add(weekdayStr);
    let availibilitiesToProcess = availibility[weekdayStr] == null ? [] : availibility[weekdayStr];
    if (availibilitiesToProcess == null) availibilitiesToProcess = [];
    availibilitiesToProcess.forEach((availibilityInterval) => {
      const availibilityWithDate = insertDateIntoInterval(
        availibilityInterval,
        date.toJSDate(),
        availibility.timeZone
      );
      availibilityAsIntervals.push(
        Interval.fromDateTimes(availibilityWithDate[0], availibilityWithDate[1])
      );
    });
  });

  const unavaibililites = calculateBetweenIntervals(
    DateTime.fromISO(start),
    DateTime.fromISO(end),
    availibilityAsIntervals
  );
  const userEvents = (await getEventFeed(start, end, userId)).map((event) => {
    return Interval.fromDateTimes(DateTime.fromISO(event.start), DateTime.fromISO(event.end));
  });

  const completeUnavailibilites = unavaibililites.concat(userEvents);

  const mergedUnavilibilites = Interval.merge(completeUnavailibilites);

  const finalAvailibility = calculateBetweenIntervals(
    DateTime.fromISO(start),
    DateTime.fromISO(end),
    mergedUnavilibilites
  );

  const availibilityCalendarEvents: CalendarEvent[] = finalAvailibility.map((interval) => {
    return {
      id: user.id,
      backgroundColor: hash.hex(user.firstName + " " + user.lastName) as string,
      title: user.firstName + " " + user.lastName + " is Available",
      start: interval.start.toISO(),
      end: interval.end.toISO(),
    };
  });
  return availibilityCalendarEvents;
};

export { getAvailibilityFeed };
