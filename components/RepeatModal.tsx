/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import React, { useState, useEffect } from "react";
import styles from "../styles/RepeatModal.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker/dist/entry.nostyle";

type RepeatModalProps = {
  handleClose: () => void;
  handleStates: (
    repeat: boolean,
    interval: number,
    weekDays: number[],
    endSelection: string,
    endDate: Date,
    count: number
  ) => void;
  // props for initial state values
  initRepeat: boolean;
  initInterval: number;
  initWeekDays: number[];
  initEndSelection: string;
  initEndDate: Date;
  initCount: number;
};

const RepeatModal: React.FC<RepeatModalProps> = ({
  handleClose,
  handleStates,
  initRepeat,
  initInterval,
  initWeekDays,
  initEndSelection,
  initEndDate,
  initCount,
}) => {
  // repeat modal states initialized by init props
  const [repeat, setRepeat] = useState(initRepeat);
  const [interval, setInterval] = useState(initInterval);
  const [weekDays, setWeekDays] = useState<number[]>(initWeekDays);
  const [endSelection, setEndSelection] = useState(initEndSelection);
  const [endDate, setEndDate] = useState(initEndDate);
  const [count, setCount] = useState(initCount);
  const [valid, setValid] = useState(false);

  // validate modal on field input
  useEffect(() => {
    setValid(true);
    if (repeat) {
      if (!interval) {
        setValid(false);
      }
      if (endSelection === "on" && !endDate) {
        setValid(false);
      }
      if (endSelection === "after" && !count) {
        setValid(false);
      }
    }
  }, [repeat, interval, weekDays, endSelection, endDate, count]);

  // display strings for week days
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  // adds/removes day from weekDay state
  const handleDayOfWeekChange = (day: number): void => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((item) => item !== day));
    } else {
      setWeekDays((weekDays) => [...weekDays, day]);
    }
  };

  // converts daysOfWeek idx to RRule weekday idx (0 == RRule.MO, ...)
  const convertDayIdx = (idx: number): number => {
    return (((idx - 1) % 7) + 7) % 7;
  };

  // passes state values to callback and closes modal on save
  const handleSave = (): void => {
    handleStates(repeat, interval, weekDays, endSelection, endDate, count);
    handleClose();
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        <div className={styles.headerWrapper}>
          <p className={styles.title}>Repeat</p>
          <div>
            <label className={styles.switch}>
              <input type="checkbox" checked={repeat} onChange={() => setRepeat(!repeat)} />
              <span className={`${styles.slider} ${styles.round}`}></span>
            </label>
          </div>
        </div>

        <div className={styles.row}>
          <p className={styles.largeLabel}>Repeat every</p>
          <input
            className={styles.numberInput}
            disabled={!repeat}
            type="number"
            min={1}
            value={interval}
            onChange={(e) => setInterval(e.target.valueAsNumber)}
          />
          <input className={styles.freqField} disabled={!repeat} value="weekly" readOnly />
        </div>

        <p className={styles.smallLabel}>Repeat on</p>
        <div className={styles.dayOfWeekWrapper}>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              onClick={() => repeat && handleDayOfWeekChange(convertDayIdx(idx))}
              className={`${styles.circle} ${!repeat && styles.disabledCircle} ${
                repeat && weekDays.includes(convertDayIdx(idx)) ? styles.activeCircle : null
              }`}
            >
              <p
                className={`${styles.smallLabel} ${
                  repeat && weekDays.includes(convertDayIdx(idx)) ? styles.darkLabel : null
                }`}
              >
                {day}
              </p>
            </div>
          ))}
        </div>

        <p className={styles.smallLabel}>Ends</p>
        <div className={styles.neverOptionWrapper}>
          <input
            className={styles.radio}
            disabled={!repeat}
            type="radio"
            name="repeat"
            value="never"
            checked={endSelection === "never"}
            onChange={(e) => setEndSelection(e.target.value)}
          />
          <label>Never</label>
        </div>
        <div className={styles.radioOptionWrapper}>
          <input
            className={styles.radio}
            disabled={!repeat}
            type="radio"
            name="repeat"
            value="on"
            checked={endSelection === "on"}
            onChange={(e) => setEndSelection(e.target.value)}
          />
          <label>On</label>
          <DatePicker
            disabled={!repeat || endSelection !== "on"}
            className={styles.dateInput}
            onChange={setEndDate}
            value={endDate}
            calendarIcon={null}
            clearIcon={null}
          />
        </div>
        <div className={styles.radioOptionWrapper}>
          <input
            className={styles.radio}
            disabled={!repeat}
            type="radio"
            name="repeat"
            value="after"
            checked={endSelection === "after"}
            onChange={(e) => setEndSelection(e.target.value)}
          />
          <label>After</label>
          <input
            disabled={!repeat || endSelection !== "after"}
            className={styles.numberInput}
            type="number"
            min={1}
            value={count}
            onChange={(e) => setCount(e.target.valueAsNumber)}
          />
          <p className={styles.labelLarge}> occurrences</p>
        </div>

        <div className={styles.buttonWrapper}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button disabled={!valid} onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export { RepeatModal };