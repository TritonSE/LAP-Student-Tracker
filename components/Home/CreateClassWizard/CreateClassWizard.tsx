import React, { useContext, useEffect, useState } from "react";
import { RepeatModal } from "./RepeatModal";
import { APIContext } from "../../../context/APIContext";
import { CreateClass, CreateClassEvent } from "../../../models";
import { RRule } from "rrule";
import { DateTime } from "luxon";
import { CirclePicker } from "react-color";
import { ColorResult } from "react-color/index";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import useSWR from "swr";
import styles from "./CreateClassWizard.module.css";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import TextField from "@mui/material/TextField";
import { DesktopTimePicker } from "@mui/x-date-pickers";

// Work around for date/time picker library to work with NextJS
// https://github.com/vercel/next.js/issues/19936
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";
import { Autocomplete } from "@mui/material";

type CreateClassWizardProps = {
  handleClose: () => void;
};

const CreateClassWizard: React.FC<CreateClassWizardProps> = ({ handleClose }) => {
  // create wizard states
  const [name, setName] = useState<string>("");
  const [multipleLevels, setMultipleLevels] = useState<boolean>(false);
  const [minLevel, setMinLevel] = useState<number>(1);
  const [maxLevel, setMaxLevel] = useState<number>(1);
  const [startDate, setStartDate] = useState<DateTime>(DateTime.now());
  const [startTime, setStartTime] = useState<DateTime | null>(null);
  const [endTime, setEndTime] = useState<DateTime | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showRepeatModal, setShowRepeatModal] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ffc702");

  // selected teachers from dropdown (string of emails)
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  // selected students from dropdown (sting of id's)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [ignoreAvailabilities, setIgnoreAvailabilities] = useState(false);

  const [valid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [errMsg, setErrMsg] = useState<string>("");

  // saved repeat modal states
  const [weekDays, setWeekDays] = useState<number[]>([(((new Date().getDay() - 1) % 7) + 7) % 7]);
  const [endType, setEndType] = useState<string>("never");
  const [endDate, setEndDate] = useState<DateTime>(DateTime.fromJSDate(new Date()));
  const [count, setCount] = useState<number>(1);
  const [rruleText, setRruleText] = useState<string>(
    new RRule({
      interval: 1,
      freq: RRule.WEEKLY,
      byweekday: weekDays,
    }).toText()
  );

  // get all teachers in order to select them in the dropdown
  const { data: allTeachers, error: fetchTeacherError } = useSWR("/api/users?filter=Teacher", () =>
    client.getAllUsers("Teacher")
  );

  const { data: allStudents, error: fetchStudentError } = useSWR("/api/users?filter=Student", () =>
    client.getAllUsers("Student")
  );

  // since all teachers can be undefined, check here and use an empty array if it is
  const teachers = allTeachers ? allTeachers : [];
  const students = allStudents ? allStudents : [];

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
  const teachersValid = selectedTeachers.length > 0;
  const levelsValid = !!minLevel && (!multipleLevels || !!maxLevel);
  const startDateValid = startDate != null;
  const startTimeValid = startTime != null;
  const endTimeValid = endTime != null;
  const startBeforeEndTime = startTimeValid && endTimeValid && startTime < endTime;
  const startBeforeEndDate = startDate <= endDate || endType != "on";
  const countValid = count < 20;

  useEffect(() => {
    setValid(
      nameValid &&
        teachersValid &&
        levelsValid &&
        startDateValid &&
        startTimeValid &&
        endTimeValid &&
        startBeforeEndDate &&
        startBeforeEndTime &&
        countValid
    );
    const errorMessage = fetchTeacherError
      ? fetchTeacherError.message
      : fetchStudentError
      ? fetchTeacherError.message
      : !nameValid
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
      : !startBeforeEndTime
      ? "Please ensure that the start time is before the end time"
      : !countValid
      ? "Please only have 20 repeat occurrences of an event "
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
    startBeforeEndTime,
    countValid,
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
    endDateParam: DateTime,
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
        dtstart:startDate.setZone("UTC", {keepLocalTime: true}).toJSDate(),
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays,
        until: endDate.toJSDate(),
        tzid: 'America/Los_Angeles'
      });
    } else if (endType === "after") {
      rrule = new RRule({
        dtstart: startDate.setZone("UTC", {keepLocalTime: true}).toJSDate(),
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays.sort(),
        count: count,
        tzid: 'America/Los_Angeles'
      });
    } else {
      rrule = new RRule({
        dtstart: startDate.setZone("UTC", {keepLocalTime: true}).toJSDate(),
        interval: 1,
        freq: RRule.WEEKLY,
        byweekday: weekDays.sort(),
        tzid: 'America/Los_Angeles'
      });
    }
    const rruleStr = rrule.toString();

    // this can never be true, but done to appease typechecking
    if (startTime == null || endTime == null) {
      return;
    }

    const createEvent: CreateClassEvent = {
      name: name,
      startTime: startTime.toFormat("HH:mm"),
      endTime: endTime.toFormat("HH:mm"),
      timeZone: DateTime.local().zoneName,
      rrule: rruleStr,
      language: lang,
      neverEnding: endType === "never",
      backgroundColor: colorMap[color],
      teachers: selectedTeachers,
      studentIds: selectedStudents,
      checkAvailabilities: !ignoreAvailabilities,
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
              <TextField
                label="Min Level"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                size={"small"}
                className={styles.levelInput}
                InputProps={{ inputProps: { min: 0 } }}
                value={minLevel}
                onChange={(e) => {
                  setMinLevel(parseInt(e.target.value));
                }}
              />
              {multipleLevels ? (
                <>
                  <span className={styles.dash} />
                  <TextField
                    label="Max Level"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size={"small"}
                    className={styles.levelInput}
                    InputProps={{ inputProps: { min: minLevel } }}
                    value={maxLevel}
                    onChange={(e) => {
                      setMaxLevel(parseInt(e.target.value));
                    }}
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
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <div className={styles.datePickerContainer}>
                  <DesktopDatePicker
                    inputFormat="DD"
                    className={styles.dateInput}
                    value={startDate}
                    onChange={(newDate) => {
                      setStartDate(newDate ? newDate : startDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className={styles.timePickerContainer}>
                  <DesktopTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newTime) => {
                      setStartTime(newTime);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className={styles.timePickerContainer}>
                  <DesktopTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newTime) => {
                      setEndTime(newTime);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
              </LocalizationProvider>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => setShowRepeatModal(true)}
              >
                {" "}
                {rruleText.length > 21 ? rruleText.substring(0, 17) + " ..." : rruleText}{" "}
              </Button>
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
              <div className={styles.spacing} />
              <Autocomplete
                multiple
                limitTags={5}
                id="teacher-input"
                options={teachers}
                onChange={(event, value) => setSelectedTeachers(value.map((user) => user.email))}
                getOptionLabel={(teacher) => teacher.firstName + " " + teacher.lastName}
                renderInput={(params) => (
                  <TextField {...params} label="Teachers" placeholder="Teachers" />
                )}
                isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
                sx={{ width: 750 }}
              />
            </div>

            <div className={styles.row}>
              <img className={styles.teacherIcon} src="TeacherIcon.png" />
              <div className={styles.spacing} />

              <Autocomplete
                multiple
                limitTags={10}
                id="student-input"
                options={students}
                onChange={(event, value) => setSelectedStudents(value.map((user) => user.id))}
                getOptionLabel={(student) => student.firstName + " " + student.lastName}
                renderInput={(params) => (
                  <TextField {...params} label="Students" placeholder="Students" />
                )}
                isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
                sx={{ width: 750 }}
              />
            </div>
            <div className={styles.availabilityWrapper}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={ignoreAvailabilities}
                onChange={() => setIgnoreAvailabilities(!ignoreAvailabilities)}
              />
              <label className={styles.availabilityCheckLabel}>
                Override teacher availabilities
              </label>
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

export { CreateClassWizard };
