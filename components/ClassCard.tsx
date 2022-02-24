import React from "react";
import styles from "../styles/components/LeagueViews.module.css";
import { RRule } from "rrule";
import { DateTime } from "luxon";
type ClassCardProps = {
  name: string;
  minLevel: number;
  maxLevel: number;
  rrstring: string;
  timeStart: string;
  timeEnd: string;
};

const ClassCard: React.FC<ClassCardProps> = ({
  name,
  minLevel,
  maxLevel,
  rrstring,
  timeStart,
  timeEnd,
}) => {
  const weekday: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const rule = RRule.fromString(rrstring);
  //geting all days of week from the rrule object to output
  const dates = rule.options.byweekday.map((val) => weekday[val]).join(", ");

  //this takes in the start and end times, converts them to ISO format, then outputs the hour the class starts and ends
  const convertTime = (startTime: string, endTime: string): string => {
    const startTimeISO = DateTime.fromISO(startTime).toLocal().toFormat("h");
    const endTimeISO = DateTime.fromISO(endTime).toLocal().toFormat("ha");
    const finalTimes = startTimeISO + " - " + endTimeISO;
    return finalTimes + "";
  };
  return (
    <div className={styles.listElem}>
      <div>
        <p className={styles.leftText}>{`${name} ${
          minLevel === maxLevel ? minLevel : minLevel + "-" + maxLevel
        }`}</p>
      </div>
      <div className={styles.rightText}>
        {[dates, "•", convertTime(timeStart, timeEnd)].join(" ")}
      </div>
    </div>
  );
};

export { ClassCard };
