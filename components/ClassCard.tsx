import moment from "moment";
import styles from "../styles/components/LeagueViews.module.css";
import { RRule, RRuleSet, rrulestr } from "rrule";

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
  const rule = RRule.fromString(rrstring);
  const tempRule = rule.toText();
  //geting all days of week from the rrule object to output
  const dates = tempRule.substring(tempRule.indexOf("on") + 3, tempRule.indexOf("until"));
  //this takes in teh start and end times, converts them to ISO format, then outputs the hour the class starts and ends
  const convertTime = (startTime: string, endTime: string) => {
    const { DateTime } = require("luxon");
    const startTime_ISO = DateTime.fromISO(startTime);
    const endTime_ISO = DateTime.fromISO(endTime);
    const finalTimes =
      DateTime.fromISO(startTime_ISO).toFormat("h") +
      " - " +
      DateTime.fromISO(endTime_ISO).toFormat("ha");
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

export default ClassCard;
