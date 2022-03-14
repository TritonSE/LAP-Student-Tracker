/* eslint-disable import/extensions */
import React, { useState, useEffect, useContext } from "react";
import { RepeatModal } from "./RepeatModal";
import { APIContext } from "../context/APIContext";
import { CreateClass } from "../models/class";
import { CreateClassEvent } from "../models/events";
import styles from "../styles/CreateEventsWizard.module.css";

// Work around for date/time picker library to work with NextJS
// https://github.com/vercel/next.js/issues/19936
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import TimePicker from "react-time-picker/dist/entry.nostyle";

import { RRule } from "rrule";
import { DateTime } from "luxon";
import { CirclePicker } from "react-color";

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
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [rruleText, setRruleText] = useState("Never Repeat");
  const [color, setColor] = useState("#ffc702");
  const [teachers, setTeachers] = useState("");
  const [valid, setValid] = useState(false);

  // saved repeat modal states
  const [repeat, setRepeat] = useState(false);
  const [interval, setInterval] = useState(1);
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [endType, setEndType] = useState("never");
  const [endDate, setEndDate] = useState(new Date());
  const [count, setCount] = useState(1);

  const client = useContext(APIContext);

  const colorMap: { [name: string]: string } = {
    "#ffc702": "yellow",
    "#ef5da8": "magenta",
    "#46d5b3": "mint",
    "#5d5fef": "purple",
    "#5ec0f0": "blue",
    "#ff0202": "red",
  };

  // validates event wizard on field input
  useEffect(() => {
    setValid(true);
    if (!name || !teachers) {
      setValid(false);
    }
    if (!minLevel || (multipleLevels && (!maxLevel || minLevel >= maxLevel))) {
      setValid(false);
    }
    if (!startDate || !startTime || !endTime) {
      setValid(false);
    }
  }, [name, multipleLevels, minLevel, maxLevel, startDate, startTime, endTime, color, teachers]);

  // force max level to exceed min level
  useEffect(() => {
    if (minLevel >= maxLevel) {
      setMaxLevel(minLevel + 1);
    }
  }, [minLevel, maxLevel]);

  // callback for hiding modal on close
  const handleRepeatClose = (): void => {
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
  ): void => {
    setRepeat(repeat_param);
    if (repeat_param) {
      setInterval(interval_param);
      setWeekDays(weekDays_param);
      setEndType(endType_param);
      setEndDate(endDate_param);
      setCount(count_param);

      // rrule text to display on button
      const rule = new RRule({
        interval: interval_param,
        freq: RRule.WEEKLY,
        byweekday: weekDays_param,
      });
      setRruleText(rule.toText());
    } else {
      setRruleText("Never Repeat");
    }
  };

  // handles create wizard submit
  const handleSubmit = async (): Promise<void> => {
    let lang = "unknown";
    if (name.toLowerCase().includes("java")) {
      lang = "Java";
    } else if (name.toLowerCase().includes("python")) {
      lang = "Python";
    }

    // construct rrule object
    let rrule;
    if (repeat) {
      if (endType === "on") {
        rrule = new RRule({
          dtstart: startDate,
          interval: interval,
          freq: RRule.WEEKLY,
          byweekday: weekDays,
          until: endDate,
        });
      } else if (endType === "after") {
        rrule = new RRule({
          dtstart: startDate,
          interval: interval,
          freq: RRule.WEEKLY,
          byweekday: weekDays,
          count: count,
        });
      } else {
        rrule = new RRule({
          dtstart: startDate,
          interval: interval,
          freq: RRule.WEEKLY,
          byweekday: weekDays,
        });
      }
    } else {
      rrule = new RRule({
        dtstart: startDate,
        count: 1,
      });
    }
    const rruleStr = rrule.toString();

    const createEvent: CreateClassEvent = {
      name: name,
      startTime: startTime,
      endTime: endTime,
      timeZone: DateTime.local().zoneName,
      rrule: rruleStr,
      language: lang,
      neverEnding: repeat && endType === "never",
      backgroundColor: colorMap[color],
      teachers: teachers.split(","),
    };

    try {
      // Create class event and calendar information
      const classEvent = await client.createClassEvent(createEvent);
      try {
        // create class from event id
        const createClass: CreateClass = {
          eventInformationId: classEvent.eventInformationId,
          minLevel: minLevel,
          maxLevel: multipleLevels ? maxLevel : minLevel,
          rrstring: rruleStr,
          language: lang,
          startTime: classEvent.startTime,
          endTime: classEvent.endTime,
        };
        await client.createClass(createClass);
      } catch (err) {
        alert("Error on class creation");
        return;
      }
    } catch (err) {
      alert("Error on class event creation");
      return;
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
                    min={minLevel + 1}
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
                clearIcon={null}
                openCalendarOnFocus={false}
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

            <div className={styles.dropDownWrapper}>
              <div className={styles.dropDown} onClick={() => setShowColorPicker(!showColorPicker)}>
                <span className={styles.colorCircle} style={{ background: color }} />
                <span className={styles.arrow} />
              </div>
              {showColorPicker ? (
                <div className={styles.popover}>
                  <div className={styles.cover} onClick={() => setShowColorPicker(false)} />
                  <CirclePicker
                    width={80}
                    height={136}
                    colors={Object.keys(colorMap)}
                    hex={color}
                    onChange={(c: any) => setColor(c.hex)}
                  />
                </div>
              ) : null}
            </div>
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
            <button disabled={!valid} onClick={handleSubmit} className={styles.confirmButton}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { CreateEventsWizard };
