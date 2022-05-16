import React from "react";
import style from "./AdminHomePage.module.css";
import { RRule } from "rrule";
import { DateTime } from "luxon";
type HomePageClassCard = {
  name: string;
  minLevel: number;
  maxLevel: number;
  rrstring: string;
  startTime: string;
  endTime: string;
  teachers: {
    userId: string;
    firstName: string;
    lastName: string;
}[];
};

const HomePageClassCard: React.FC<HomePageClassCard> = ({
  name,
  minLevel,
  maxLevel,
  rrstring,
  startTime,
  endTime,
  teachers,
}) => {
  const teacher: string[] = [
    "Teacher1", "Teacher2"
  ];
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
  const dates = rule.options.byweekday.map((val) => weekday[val]).join(", ");
  const teacherNames = teachers.map((val) => val.firstName)
  //console.log(teachers);
  //this takes in the start and end times, converts them to ISO format, then outputs the hour the class starts and ends
  const convertTime = (timeStart: string, timeEnd: string): string => {
    const startTimeISO = DateTime.fromISO(timeStart).toLocal().toFormat("h:mm");
    const endTimeISO = DateTime.fromISO(timeEnd).toLocal().toFormat("h:mma");
    const finalTimes = startTimeISO + " - " + endTimeISO;
    return finalTimes + "";
  };
  return (
    <div className={style.card}>
      <div>
        <div className={style.title}>
          <a href="">
            {`${name}
        ${minLevel === maxLevel ? minLevel : minLevel + "-" + maxLevel}`}
          </a>
        </div>
        <div className={style.name}>{teacherNames.join(", ")}</div>
      </div>

      <div className={style.times}>{[dates, "•", convertTime(startTime, endTime)].join(" ")}</div>
    </div>
  );
};

export { HomePageClassCard };
