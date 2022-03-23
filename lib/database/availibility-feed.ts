import { Interval, DateTime, Duration } from "luxon"
import { getAvailibilityById } from "./availibilities";
import { getEventFeed } from "./calendar-events";
import { getUser } from "./users";

const indexToWeekdays = [
  "temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"
]

type Weekdays = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"


const getDatesInInterval = (start: string, end: string): Array<DateTime> => {
  const interval = Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end))
  let dates = [];
  let cursor = interval.start.startOf("day");
  while (cursor < interval.end) {
    dates.push(cursor)
    cursor = cursor.plus({ days: 1 })
  }
  return dates;
}

const getDateTime = (time: string, date: Date, timeZone: string): DateTime => {
  return DateTime.fromFormat(time, "HH:mm").set({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }).setZone(timeZone);
}

const insertDateIntoInterval = (interval: string[], date: Date, timeZone: string) => {
  return [getDateTime(interval[0], date, timeZone), getDateTime(interval[1], date, timeZone)]
}


const calculateBetweenIntervals = (start: DateTime, end: DateTime, intervals: Interval[]) => {
  const newIntervals = intervals.map((interval, index) => {
    if (index == 0) return Interval.fromDateTimes(start, interval.start);
    return Interval.fromDateTimes(intervals[index - 1].end, interval.start)
  })
  newIntervals.push(Interval.fromDateTimes(intervals[intervals.length - 1].end, end))
  return newIntervals.filter((interval) => interval.length("milliseconds") != 0 && interval.isValid)
}

// get all intervals with dates
// calculate unavailibilities 
// use merge from luxon on unavaibililites and events
// reverse unavailibilities

const getAvailibilityFeed = async (start: string, end: string, userId: string) => {
  const dates = getDatesInInterval(start, end);
  const user = await getUser(userId)
  if (user == null) {
    throw Error("Could not retrieve user from database");
  }
  const availibility = await getAvailibilityById(userId);
  if (availibility == null) {
    throw Error("Could not fetch availibility for user");
  }
  let availibilityAsIntervals: Interval[] = [];
  const processedDaysOfWeek = new Set<String>();
  dates.forEach((date) => {
    const weekdayStr = indexToWeekdays[date.weekday] as Weekdays;
    if (processedDaysOfWeek.has(weekdayStr) || weekdayStr == "sun")
      return

    processedDaysOfWeek.add(weekdayStr);
    const availibilitiesToProcess = availibility[weekdayStr];
    if (availibilitiesToProcess == null)
      return
    availibilitiesToProcess.forEach((availibilityInterval) => {
      const availibilityWithDate = insertDateIntoInterval(availibilityInterval, date.toJSDate(), availibility.timeZone)
      availibilityAsIntervals.push(Interval.fromDateTimes(availibilityWithDate[0], availibilityWithDate[1]))
    })
  })


  const unavaibililites = calculateBetweenIntervals(DateTime.fromISO(start), DateTime.fromISO(end), availibilityAsIntervals);


  const userEvents = (await getEventFeed(start, end, userId)).map((event) => {
    return Interval.fromDateTimes(DateTime.fromISO(event.startStr), DateTime.fromISO(event.endStr))
  })


  let completeUnavailibilites = unavaibililites.concat(userEvents)

  const mergedUnavilibilites = Interval.merge(completeUnavailibilites);

  const finalAvailibility = calculateBetweenIntervals(DateTime.fromISO(start), DateTime.fromISO(end), mergedUnavilibilites);

  return finalAvailibility.map((interval) => {
    return {
      title: user.firstName + " " + user.lastName + " is Available",
      start: interval.start.toISO(),
      end: interval.end.toISO()
    }
  })
}

export { getAvailibilityFeed }