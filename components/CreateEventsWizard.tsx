import React, { useState } from "react";
import RepeatModal from "./RepeatModal";
import styles from "../styles/CreateEventsWizard.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import { RRule } from "rrule";

type CreateEventsWizardProps = {
  handleClose: () => void;
};

const CreateEventsWizard: React.FC<CreateEventsWizardProps> = ({ handleClose }) => {
  const [multipleLevels, setMultipleLevels] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [rruleStr, setRruleStr] = useState("No Repeat");

  const [repeat, setRepeat] = useState(false);
  const [interval, setInterval] = useState(1);
  const [freq, setFreq] = useState("weekly");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [endType, setEndType] = useState("never");
  const [endDate, setEndDate] = useState(new Date());
  const [count, setCount] = useState(1);

  const freqMap = {
    weekly: RRule.WEEKLY,
    daily: RRule.DAILY,
    monthly: RRule.MONTHLY,
  };

  const handleRepeatClose = () => {
    setShowRepeatModal(false);
  };

  const handleRepeatStates = (
    repeat_param: boolean,
    interval_param: number,
    freq_param: string,
    weekDays_param: number[],
    endType_param: string,
    endDate_param: Date,
    count_param: number
  ) => {
    setRepeat(repeat_param);
    if (repeat_param) {
      setInterval(interval_param);
      alert(interval_param);
      setFreq(freq_param);
      setWeekDays(weekDays_param);
      setEndType(endType_param);
      setEndDate(endDate_param);
      setCount(count_param);

      const rule = new RRule({
        interval: interval_param,
        freq: freqMap[freq_param],
        byweekday: weekDays_param,
      });

      setRruleStr(rule.toText());
    } else {
      setRruleStr("No Repeat");
    }
  };

  const handleSubmit = () => {
    alert("submitted");
    var rule;
    if (repeat) {
      switch (endType) {
        case "never":
          rule = new RRule({
            interval: interval,
            freq: freqMap[freq],
            byweekday: weekDays,
          });
          break;
        case "on":
          rule = new RRule({
            interval: interval,
            freq: freqMap[freq],
            byweekday: weekDays,
          });
          break;
        case "after":

        default:
        // code block
      }
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
          initFreq={freq}
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
              <input className={styles.levelInput} type="number" min={1} />
              {multipleLevels ? (
                <>
                  <span className={styles.dash} />
                  <input className={styles.levelInput} type="number" min={1} />
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
                {rruleStr}
              </button>
            </div>

            <select className={styles.dropDown}>
              <option value="" selected>
                Yellow
              </option>
              <option value="">Blue</option>
            </select>

            <div className={styles.row}>
              <img className={styles.teacherIcon} src="TeacherIcon.png" />
              <input className={styles.textInput} type="text" placeholder="Add teachers" />
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
