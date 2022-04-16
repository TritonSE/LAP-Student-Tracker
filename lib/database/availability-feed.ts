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
const getAllDatesBetweenStartAndEnd = (start: DateTime, end: DateTime): DateTime[] => {
    // get the interval corresponding to the start and end strings
    const interval = Interval.fromDateTimes(start, end);
    const seenDates = new Set<number>();
    const dates: DateTime[] = [];

    let cursor = interval.start.startOf("hour");
    while (cursor < interval.end) {
        if (!seenDates.has(cursor.day)) {
            dates.push(cursor.startOf("day"));
            seenDates.add(cursor.day);
        }
        cursor = cursor.plus({hour: 1});
    }

    return dates;
};

const timeDateZoneToDateTime = (time: string, date: DateTime, timeZone: string): DateTime => {
    return DateTime.fromFormat(time, "HH:mm").set({
        year: date.year,
        month: date.month,
        day: date.day
    }).setZone(timeZone, {keepLocalTime: true});
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

    const compare = (a: Interval, b: Interval): number => {
        return a.start >= b.start ? 1 : -1;
    };

    const mergeIntervals = Interval.merge(intervals).sort( (a: Interval, b) => {return compare(a,b);});


    const newIntervals = mergeIntervals.map((interval, index) => {
        if (index == 0) return Interval.fromDateTimes(start, interval.start);
        return Interval.fromDateTimes(mergeIntervals[index - 1].end, interval.start);
    });
    newIntervals.push(Interval.fromDateTimes(mergeIntervals[mergeIntervals.length - 1].end, end));
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

    const user = await getUser(userId);
    if (user == null) {
        throw Error("Could not retrieve user from database");
    }
    const availability = await getAvailabilityById(userId);
    if (availability == null) {
        throw Error("Could not fetch availability for user");
    }

    const dateTimeStart =  DateTime.fromISO(start, {zone: availability.timeZone});
    const dateTimeEnd = DateTime.fromISO(end, {zone: availability.timeZone});

    const dates = getAllDatesBetweenStartAndEnd(dateTimeStart, dateTimeEnd);


    const availabilityAsIntervals: Interval[] = [];
    dates.forEach((date) => {
        const weekdayStr = indexToWeekdays[date.weekday] as Weekdays;

        if (weekdayStr == "sun") return;

        const availabilitiesToInsertDateInto = availability[weekdayStr] == null ? [] : availability[weekdayStr] as string[][];

        availabilitiesToInsertDateInto.forEach((availabilityInterval) => {
            const availableStartTime = availabilityInterval[0];
            const availableEndTime = availabilityInterval[1];
            const availableStartDateTime = timeDateZoneToDateTime(availableStartTime, date, availability.timeZone);
            const availableEndDateTime = timeDateZoneToDateTime(availableEndTime, date, availability.timeZone);
            availabilityAsIntervals.push(Interval.fromDateTimes(availableStartDateTime, availableEndDateTime));
        });
    });


    // custom comparator for sorting


    // const mergedAvailibilities = Interval.merge(availabilityAsIntervals);


    const unavailability = calculateBetweenIntervals(
        DateTime.fromISO(start, {zone: availability.timeZone}),
        DateTime.fromISO(end, {zone: availability.timeZone}),
        availabilityAsIntervals
    );
    const userEvents = (await getEventFeed(start, end, userId)).map((event) => {
        return Interval.fromDateTimes(DateTime.fromISO(event.start, {zone: availability.timeZone}), DateTime.fromISO(event.end, {zone: availability.timeZone}));
    });

    const completeUnavailability = unavailability.concat(userEvents);


    const finalAvailability = calculateBetweenIntervals(
        DateTime.fromISO(start, {zone: availability.timeZone}),
        DateTime.fromISO(end, {zone: availability.timeZone}),
        completeUnavailability
    );

    return finalAvailability.map((interval) => {
        return {
            id: user.id,
            backgroundColor: hash.hex(user.firstName + " " + user.lastName) as string,
            title: user.firstName + " " + user.lastName + " is Available",
            start: interval.start.toLocal().toISO(),
            end: interval.end.toLocal().toISO(),
        };
    });
};

export {getAvailabilityFeed};
