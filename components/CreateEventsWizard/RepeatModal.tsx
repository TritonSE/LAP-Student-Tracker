/* eslint-disable import/extensions */
import React, { useState, useEffect } from "react";
import styles from "./RepeatModal.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-date-picker/dist/entry.nostyle";

type RepeatModalProps = {
  handleClose: () => void;
  handleStates: (weekDays: number[], endSelection: string, endDate: Date, count: number) => void;
  // props for initial state values
  initWeekDays: number[];
  initEndSelection: string;
  initEndDate: Date;
  initCount: number;
};

const RepeatModal: React.FC<RepeatModalProps> = ({
  handleClose,
  handleStates,
  initWeekDays,
  initEndSelection,
  initEndDate,
  initCount,
}) => {
  // repeat modal states initialized by init props
  const [weekDays, setWeekDays] = useState<number[]>(initWeekDays);
  const [endSelection, setEndSelection] = useState(initEndSelection);
  const [endDate, setEndDate] = useState(initEndDate);
  const [count, setCount] = useState(initCount);
  const [valid, setValid] = useState(false);

  // validates repeat modal fields on state change
  const weekDaysValid = weekDays.length > 0;
  const endSelectionValid =
    endSelection === "on"
      ? endDate != null
      : endSelection === "after"
      ? !!count
      : endSelection === "never"
      ? true
      : false;

  useEffect(() => {
    setValid(weekDaysValid && endSelectionValid);
  }, [weekDaysValid, endSelectionValid]);

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
    handleStates(weekDays, endSelection, endDate, count);
    handleClose();
  };

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        <div className={styles.headerWrapper}>
          <p className={styles.title}>Repeat</p>
        </div>

        <div className={styles.row}>
          <p className={styles.largeLabel}>Repeats weekly</p>
        </div>

        <p className={styles.smallLabel}>Repeat on</p>
        <div className={styles.dayOfWeekWrapper}>
          {daysOfWeek.map((day, idx) => (
            <div
              key={idx}
              onClick={() => handleDayOfWeekChange(convertDayIdx(idx))}
              className={`${styles.circle} ${
                weekDays.includes(convertDayIdx(idx)) ? styles.activeCircle : null
              }`}
            >
              <p
                className={`${styles.smallLabel} ${
                  weekDays.includes(convertDayIdx(idx)) ? styles.darkLabel : null
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
            type="radio"
            name="repeat"
            value="on"
            checked={endSelection === "on"}
            onChange={(e) => setEndSelection(e.target.value)}
          />
          <label>On</label>
          <DatePicker
            disabled={endSelection !== "on"}
            className={styles.dateInput}
            onChange={setEndDate}
            value={endDate}
            clearIcon={null}
            openCalendarOnFocus={false}
          />
        </div>
        <div className={styles.radioOptionWrapper}>
          <input
            className={styles.radio}
            type="radio"
            name="repeat"
            value="after"
            checked={endSelection === "after"}
            onChange={(e) => setEndSelection(e.target.value)}
          />
          <label>After</label>
          <input
            disabled={endSelection !== "after"}
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
