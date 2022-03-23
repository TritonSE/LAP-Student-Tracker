import { Interval, DateTime, Duration } from "luxon"
import { getAvailibilityById } from "./availibilities";
import { getEventFeed } from "./calendar-events";

const weekdays = [
  "temp", "mon", "tue", "wed", "thu", "fri", "sat", "sun"
]


const getDatesInInterval = (start: string, end: string): Array<DateTime> => {
  const interval = Interval.fromDateTimes(DateTime.fromISO(start), DateTime.fromISO(end))
  let dates = [];
  let cursor = interval.start.startOf("day");
  while (cursor < interval.end) {
    dates.push(cursor)
    cursor = cursor.plus({ days: 1 })
  }
  // console.log(dates)
  return dates;
}

const getDateTime = (time: string, date: Date, timeZone: string): DateTime => {
  const x = DateTime.fromFormat(time, "HH:mm").set({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  }).setZone(timeZone);
  return x;
}

const insertDateIntoInterval = (interval: string[], date: Date, timeZone: string) => {
  const x = [getDateTime(interval[0], date, timeZone), getDateTime(interval[1], date, timeZone)]
  // console.log(x)
  return x
}

const insertDateIntoAvailibility = (intervals: string[][] | null, date: Date, timeZone: string): DateTime[][] | null => {
  if (intervals == null) return null;
  const availibilityWithDate = intervals.map((interval) => {
    const start = getDateTime(interval[0], date, timeZone);
    const end = getDateTime(interval[1], date, timeZone)
    return [start, end]
  })
  return availibilityWithDate;
}

const calculateBetweenIntervals = (start: DateTime, end: DateTime, intervals: Interval[], print?: boolean) => {
  if (print) {
    console.log(intervals)
  }
  const newIntervals = intervals.map((interval, index) => {
    if (index == 0) return Interval.fromDateTimes(start, interval.start);
    return Interval.fromDateTimes(intervals[index - 1].end, interval.start)
  })

  newIntervals.push(Interval.fromDateTimes(intervals[intervals.length - 1].end, end))
  return newIntervals.filter((interval) => interval.length("milliseconds") != 0 && interval.isValid)

  // let opInterval = [Interval.fromDateTimes(start, intervals[0].start)];
  // for (let i = 1; i < intervals.length; i += 1) {
  //   opInterval.push(Interval.fromDateTimes(intervals[i - 1].end, intervals[i].start))
  // }
  // opInterval.push(Interval.fromDateTimes(intervals[intervals.length - 1].end, end))

  // const intervalOpposite = intervals.map((currInterval, index) => {
  //   if (index == 0) return Interval.fromDateTimes(start, currInterval.start)
  //   if (index == intervals.length - 1) return Interval.fromDateTimes(currInterval.end, end)
  //   return Interval.fromDateTimes(intervals[index - 1].end, currInterval.start)
  // }).filter((interval) => interval.length("milliseconds") != 0 && interval.isValid)

  return opInterval
}

// get all intervals with dates
// calculate unavailibilities 
// use merge from luxon on unavaibililites and events
// reverse unavailibilities

const getAvailibilityFeed = async (start: string, end: string, userId: string) => {
  const dates = getDatesInInterval(start, end);
  // console.log(dates)
  const availibility = await getAvailibilityById(userId);
  // console.log(availibility)
  if (availibility == null) {
    throw Error("Could not fetch availibility for user")
  }
  let x: Interval[] = [];
  const daysOfWeek = new Set<Number>();
  dates.forEach((date) => {
    if (!daysOfWeek.has(date.weekday) || weekdays[date.weekday] != "sun") {
      daysOfWeek.add(date.weekday)
      const wStr = weekdays[date.weekday] as "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      const intervalToProcess = availibility[wStr];
      if (intervalToProcess != null) {
        intervalToProcess.map((availibilityInterval) => {
          return insertDateIntoInterval(availibilityInterval, date.toJSDate(), availibility.timeZone)
        }).forEach(availibilityDateTimeInterval => {
          // console.log("HERERERERE")
          // console.log(availibilityDateTimeInterval)
          x.push(Interval.fromDateTimes(availibilityDateTimeInterval[0], availibilityDateTimeInterval[1]))
        });
      }
    }
  })
  // x.forEach((i) => { console.log(i.start); console.log(i.end); console.log("END\n") })


  const unavaibililites = calculateBetweenIntervals(DateTime.fromISO(start), DateTime.fromISO(end), x);

  // unavaibililites.forEach((i) => { console.log(i.start); console.log(i.end); console.log("DONE DONE DONE") })

  const userEvents = await getEventFeed(start, end, userId);
  // console.log(userEvents)
  const events = userEvents.map((event) => {
    return Interval.fromDateTimes(DateTime.fromISO(event.startStr), DateTime.fromISO(event.endStr))
  })
  // events.forEach((i) => { console.log(i.start); console.log(i.end); console.log("DONE DONE DONE") })


  let complateUnavailibilites = unavaibililites.concat(events)
  complateUnavailibilites.forEach((i) => { console.log(i.start); console.log(i.end); console.log("DONE DONE DONE") })
  const mergedUnavilibilites = Interval.merge(complateUnavailibilites);

  // console.log(mergedUnavilibilites)
  // mergedUnavilibilites.forEach((i) => { console.log(i.start); console.log(i.end); console.log("DONE DONE DONE") })

  const finalAvailibility = calculateBetweenIntervals(DateTime.fromISO(start), DateTime.fromISO(end), mergedUnavilibilites, false);
  // finalAvailibility.map((i) => { console.log(i.start); console.log(i.end); console.log("DONE DONE DONE") })
  return finalAvailibility.map((interval) => {
    return {
      start: interval.start.toISO(),
      end: interval.end.toISO()
    }
  })
}

export { getAvailibilityFeed }