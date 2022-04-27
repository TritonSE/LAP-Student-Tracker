/* eslint-disable import/extensions */
import React, { useState, useEffect, useContext } from "react";
import { RepeatModal } from "./RepeatModal";
import { APIContext } from "../../context/APIContext";
import { CreateClass } from "../../models/class";
import { CreateClassEvent } from "../../models/events";
import styles from "./CreateEventsWizard.module.css";

// Work around for date/time picker library to work with NextJS
// https://github.com/vercel/next.js/issues/19936
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import TimePicker from "react-time-picker/dist/entry.nostyle";

import axios from "axios";
import { RRule } from "rrule";
import { DateTime } from "luxon";
import { CirclePicker } from "react-color";
import { ColorResult } from "react-color/index";
import ClipLoader from "react-spinners/ClipLoader";

type CreateEventsWizardProps = {
  handleClose: () => void;
};

const CreateEventsWizard: React.FC<CreateEventsWizardProps> = ({ handleClose }) => {
  // create wizard states
  const [name, setName] = useState<string>("");
  const [multipleLevels, setMultipleLevels] = useState<boolean>(false);
  const [minLevel, setMinLevel] = useState<number>(1);
  const [maxLevel, setMaxLevel] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>("11:00");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showRepeatModal, setShowRepeatModal] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ffc702");
  const [teachers, setTeachers] = useState<string>("");
  const [valid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // saved repeat modal states
  const [weekDays, setWeekDays] = useState<number[]>([(((new Date().getDay() - 1) % 7) + 7) % 7]);
  const [endType, setEndType] = useState<string>("never");
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [count, setCount] = useState<number>(1);
  const [rruleText, setRruleText] = useState<string>(
    new RRule({
      interval: 1,
      freq: RRule.WEEKLY,
      byweekday: weekDays,
    }).toText()
  );

  const client = useContext(APIContext);

  const colorMap: { [name: string]: string } = {
    "#ffc702": "yellow",
    "#ef5da8": "magenta",
    "#46d5b3": "mint",
    "#5d5fef": "purple",
    "#5ec0f0": "blue",
    "#ff0202": "red",
  };

  // validates event wizard fields on state change
  const nameValid = name != "";
  const teachersValid = teachers != "";
  const levelsValid = !!minLevel && (!multipleLevels || !!maxLevel);
  const startDateValid = startDate != null;
  const startTimeValid = startTime != "";
  const endTimeValid = endTime != "";
  const startBeforeEndDate = startDate <= endDate || endType != "on";

  useEffect(() => {
    setValid(
      nameValid &&
        teachersValid &&
        levelsValid &&
        startDateValid &&
        startTimeValid &&
        endTimeValid &&
        startBeforeEndDate
    );
    const errorMessage = !nameValid
      ? "Please enter a name for the class"
      : !teachersValid
      ? "Please enter at least one teacher"
      : !levelsValid
      ? "Please ensure that the max level is less than the minimum level"
      : !startDateValid
      ? "Please enter a valid start date"
      : !startTimeValid
      ? "Please enter a valid start/end time"
      : !endTimeValid
      ? "Please enter a valid end time"
      : !startBeforeEndDate
      ? "Please ensure that the end date is after the start date"
      : "";
    setErrMsg(errorMessage);
  }, [
    nameValid,
    teachersValid,
    levelsValid,
    startDateValid,
    startTimeValid,
    endTimeValid,
    startBeforeEndDate,
  ]);

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
    weekDaysParam: number[],
    endTypeParam: string,
    endDateParam: Date,
    countParam: number
  ): void => {
    setWeekDays(weekDaysParam);
    setEndType(endTypeParam);
    setEndDate(endDateParam);
    setCount(countParam);

    // rrule text to display on button
    const rule = new RRule({
      interval: 1,
      freq: RRule.WEEKLY,
      byweekday: weekDaysParam,
    });
    setRruleText(rule.toText());
  };

  // handles create wizard submit
  const handleSubmit = async (): Promise<void> => {
    setErrMsg("");
    setLoading(true);
    let lang;
    if (name.toLowerCase().includes("java")) {
      lang = "Java";
    } else if (name.toLowerCase().includes("python")) {
      lang = "Python";
    } else {
      setErrMsg("Class name must contain a language (Java or Python)");
      setLoading(false);
      return;
    }

    // construct rrule object
    let rrule;
    if (endType === "on") {
      rrule = new RRule({
        dtstart: startDate,
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays,
        until: endDate,
      });
    } else if (endType === "after") {
      rrule = new RRule({
        dtstart: startDate,
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays,
        count: count,
      });
    } else {
      rrule = new RRule({
        dtstart: startDate,
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays,
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
      neverEnding: endType === "never",
      backgroundColor: colorMap[color],
      teachers: teachers.split(",").map((teacher) => teacher.trim()),
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
          teachers: createEvent.teachers,
        };
        await client.createClass(createClass);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) setErrMsg(err.response.data);
        else if (err instanceof Error) setErrMsg(err.message);
        else setErrMsg("Error");
        setLoading(false);
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) setErrMsg(err.response.data);
      else if (err instanceof Error) setErrMsg(err.message);
      else setErrMsg("Error");
      setLoading(false);
      return;
    }

    setLoading(false);
    handleClose();
  };

  return (
    <>
      {showRepeatModal ? (
        <RepeatModal
          handleClose={handleRepeatClose}
          handleStates={handleRepeatStates}
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
                    onChange={(c: ColorResult) => setColor(c.hex)}
                  />
                </div>
              ) : null}
            </div>
            <div className={styles.row}>
              <img className={styles.teacherIcon} src="TeacherIcon.png" />
              <input
                className={styles.textInput}
                type="text"
                placeholder="Comma-separated list of teacher emails"
                value={teachers}
                onChange={(e) => setTeachers(e.target.value)}
              />
            </div>
          </div>

          <hr className={styles.line} />
          <div className={styles.footerContent}>
            <button
              disabled={!valid || loading}
              onClick={handleSubmit}
              className={styles.confirmButton}
            >
              {loading ? <ClipLoader loading={true} size={30} color={"white"} /> : "Confirm"}
            </button>
            <div className={styles.errorMsg}>{errMsg}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CreateEventsWizard };
