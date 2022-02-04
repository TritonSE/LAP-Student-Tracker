import React, { useState, useEffect } from "react";
import RepeatModal from "./RepeatModal";
//import DatePicker from 'react-datetime-picker';
import "react-date-picker/dist/DatePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-calendar/dist/Calendar.css";

import DatePicker from "react-date-picker/dist/entry.nostyle";
import TimePicker from "react-time-picker/dist/entry.nostyle";
//import TimePicker from 'react-time-picker'
import styles from "../styles/CreateEventsWizard.module.css";
import { RRule, RRuleSet, rrulestr } from "rrule";

type CreateEventsWizardProps = {
  show: boolean;
  handleClose: () => void;
};

const CreateEventsWizard: React.FC<CreateEventsWizardProps> = ({ show, handleClose }) => {
  const [multipleLevels, setMultipleLevels] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [rruleStr, setRruleStr] = useState("Set Repeat");

  const [repeat, setRepeat] = useState(false);
  const [interval, setInterval] = useState(1);
  const [freq, setFreq] = useState("weekly");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [endSelection, setEndSelection] = useState("never");
  const [endDate, setEndDate] = useState(new Date());
  const [count, setCount] = useState(1);
  /*setRepeatRule(repeatRule.rrule(new RRule({
    freq: RRule.MONTHLY,
    count: 5,
    dtstart: new Date(Date.UTC(2012, 1, 1, 10, 30))
  })));
  const rule: RRuleSet = new RRule({
    freq: RRule.WEEKLY,
    interval: 5,
    byweekday: [RRule.MO, RRule.FR],
    dtstart: new Date(Date.UTC(2012, 1, 1, 10, 30)),
    until: new Date(Date.UTC(2012, 12, 31))
  })*/
  const freqMap = {
    weekly: RRule.WEEKLY,
    daily: RRule.DAILY,
    monthly: RRule.MONTHLY,
  };

  /*useEffect(() => {
    const rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: [],
      dtstart: new Date(startDate),
    });
    //alert(rule.toText());
  }, [startDate, startTime, endTime]);*/

  const handleRepeatClose = () => {
    setShowRepeatModal(false);
  };

  const handleRepeatStates = (
    repeat_param: boolean,
    interval_param: number,
    freq_param: string,
    weekDays_param: number[],
    endSelection_param: string,
    endDate_param: Date,
    count_param: number
  ) => {
    alert(interval_param);
    setRepeat(repeat_param);
    if (repeat) {
      setInterval(interval_param);
      setFreq(freq_param);
      setWeekDays(weekDays_param);
      setEndSelection(endSelection_param);
      setEndDate(endDate_param);
      setCount(count_param);
      alert(weekDays_param);

      const rule = new RRule({
        interval: interval,
        freq: freqMap[freq],
        byweekday: weekDays,
      });
  
      setRruleStr(rule.toText());
    }
  };

  const handleSubmit = () => {
    alert("submitted");
    handleClose();
  };

  return show ? (
    <>
      <RepeatModal
        show={showRepeatModal}
        handleClose={handleRepeatClose}
        handleStates={handleRepeatStates}
      />

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
              className={`${styles.levelsWrapper} ${multipleLevels ? styles.multiLevel : styles.singleLevel
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
              <button
                className={styles.recurrenceButton}
                onClick={() => setShowRepeatModal(true)}
              >
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
  ) : null;
};

export default CreateEventsWizard;
