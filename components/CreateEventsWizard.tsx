import React, { useState, useContext } from "react";
import RepeatModal from "./RepeatModal";
import { APIContext } from "../context/APIContext";
import { CreateClass, Class } from "../models/classes";
import { CreateClassEvent, ClassEvent } from "../models/events";
import styles from "../styles/CreateEventsWizard.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";

import DatePicker from "react-date-picker/dist/entry.nostyle";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import { RRule } from "rrule";
const { DateTime } = require("luxon");

type CreateEventsWizardProps = {
  handleClose: () => void;
};

const CreateEventsWizard: React.FC<CreateEventsWizardProps> = ({ handleClose }) => {
  // create wizard states
  const [name, setName] = useState("");
  const [multipleLevels, setMultipleLevels] = useState(false);
  const [minLevel, setMinLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date().toTimeString());
  const [endTime, setEndTime] = useState(new Date().toTimeString());
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [rruleText, setRruleText] = useState("No Repeat");
  const [color, setColor] = useState("yellow");
  const [teachers, setTeachers] = useState("");

  // saved repeat modal states
  const [repeat, setRepeat] = useState(false);
  const [interval, setInterval] = useState(1);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [endType, setEndType] = useState("never");
  const [endDate, setEndDate] = useState(new Date());
  const [count, setCount] = useState(1);

  const client = useContext(APIContext);

  // callback for hiding modal on close
  const handleRepeatClose = () => {
    setShowRepeatModal(false);
  };

  // callback for setting repeat modal states on save
  const handleRepeatStates = (
    repeat_param: boolean,
    interval_param: number,
    weekDays_param: number[],
    endType_param: string,
    endDate_param: Date,
    count_param: number
  ) => {
    setRepeat(repeat_param);
    if (repeat_param) {
      setInterval(interval_param);
      setWeekDays(weekDays_param);
      setEndType(endType_param);
      setEndDate(endDate_param);
      setCount(count_param);

      const rule = new RRule({
        interval: interval_param,
        freq: RRule.WEEKLY,
        byweekday: weekDays_param,
      });

      setRruleText(rule.toText());
    } else {
      setRruleText("No Repeat");
    }
  };

  // handles create wizard submit
  const handleSubmit = async () => {
    let lang = "unknown";
    if (name.toLowerCase().includes("java")) {
      lang = "Java";
    } else if (name.toLowerCase().includes("python")) {
      lang = "Python";
    }

    let rruleStr = "";
    let rrule;
    if (repeat) {
      switch (endType) {
        case "never":
          rrule = new RRule({
            dtstart: startDate,
            interval: interval,
            freq: RRule.WEEKLY,
            byweekday: weekDays,
          });
          rruleStr = rrule.toString();
          break;
        case "on":
          rrule = new RRule({
            dtstart: startDate,
            interval: interval,
            freq: RRule.WEEKLY,
            byweekday: weekDays,
            until: endDate,
          });
          break;
        case "after":
          rrule = new RRule({
            dtstart: startDate,
            interval: interval,
            freq: RRule.WEEKLY,
            byweekday: weekDays,
            count: count,
          });
          break;
      }
    }

    const createEvent: CreateClassEvent = {
      name: name,
      startTime: startTime,
      endTime: endTime,
      timeZone: DateTime.local().zoneName,
      rrule: rruleStr,
      language: lang,
      neverEnding: endType === "never",
      backgroundColor: color,
      teachers: teachers.split(","),
    };
    console.log(createEvent);

    try {
      const classEvent = await client.createClassEvent(createEvent);
      try {
        const createClass: CreateClass = {
          minLevel: minLevel,
          maxLevel: multipleLevels ? maxLevel : minLevel,
          rrule: rruleStr,
          language: lang,
          timeStart: startTime,
          timeEnd: endTime,
        };
        await client.createClass(classEvent.id, createClass);
      } catch (err: any) {
        alert(`Error on class creation: ${err.message}`);
      }
    } catch (err: any) {
      alert(`Error on class event creation: ${err.message}`);
    }

    handleClose();
  };

  return (
    <>
      {showRepeatModal ? (
        <RepeatModal
          handleClose={handleRepeatClose}
          handleStates={handleRepeatStates}
          initRepeat={repeat}
          initInterval={interval}
          initWeekDays={weekDays}
          initEndSelection={endType}
          initEndDate={endDate}
          initCount={count}
        />
      ) : null}

      <div className={styles.wizardWrapper}>
        <div className={styles.wizardContent}>
          <div className={styles.headerContent}>
            <div className={styles.titleWrapper}>
              <img onClick={handleClose} className={styles.closeIcon} src="CloseIcon.png" />
              <p className={styles.title}>Create Class</p>
              <div className={styles.padding} />
            </div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Java Bear"
            />
          </div>

          <div className={styles.scrollableContent}>
            <div
              className={`${styles.levelsWrapper} ${
                multipleLevels ? styles.multiLevel : styles.singleLevel
              }`}
            >
              <p className={styles.label}>Levels</p>
              <input
                className={styles.levelInput}
                type="number"
                min={1}
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.valueAsNumber)}
              />
              {multipleLevels ? (
                <>
                  <span className={styles.dash} />
                  <input
                    className={styles.levelInput}
                    type="number"
                    min={1}
                    value={maxLevel}
                    onChange={(e) => setMaxLevel(e.target.valueAsNumber)}
                  />
                </>
              ) : null}
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={multipleLevels}
                onChange={() => setMultipleLevels(!multipleLevels)}
              />
              <label className={styles.checkLabel}>Multiple Levels</label>
            </div>

            <div className={styles.row}>
              <img className={styles.timeIcon} src="TimeIcon.png" />
              <DatePicker
                className={styles.dateInput}
                onChange={setStartDate}
                value={startDate}
                calendarIcon={null}
                clearIcon={null}
              />
              <TimePicker
                className={styles.timeInput}
                onChange={setStartTime}
                value={startTime}
                clearIcon={null}
                clockIcon={null}
                disableClock={true}
                format="h:mma"
              />
              <span className={styles.dash} />
              <TimePicker
                className={styles.timeInput}
                onChange={setEndTime}
                value={endTime}
                clearIcon={null}
                clockIcon={null}
                disableClock={true}
                format="h:mma"
              />
              <button className={styles.recurrenceButton} onClick={() => setShowRepeatModal(true)}>
                {rruleText}
              </button>
            </div>

            <select
              className={styles.dropDown}
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="yellow">Yellow</option>
              <option value="blue">Blue</option>
            </select>

            <div className={styles.row}>
              <img className={styles.teacherIcon} src="TeacherIcon.png" />
              <input
                className={styles.textInput}
                type="text"
                placeholder="Add teachers"
                value={teachers}
                onChange={(e) => setTeachers(e.target.value)}
              />
            </div>
          </div>

          <hr className={styles.line} />
          <div className={styles.footerContent}>
            <button onClick={handleSubmit} className={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEventsWizard;
