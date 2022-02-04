import React, { useState } from "react";
import styles from "../styles/RepeatModal.module.css";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import DatePicker from "react-date-picker/dist/entry.nostyle";

type RepeatModalProps = {
  show: boolean;
  handleClose: () => void;
  handleStates: (
    repeat: boolean,
    interval: number,
    freq: string,
    weekDays: number[],
    endSelection: string,
    endDate: Date,
    count: number
  ) => void;
};

const RepeatModal: React.FC<RepeatModalProps> = ({ show, handleClose, handleStates }) => {
  const [repeat, setRepeat] = useState(false);
  const [interval, setInterval] = useState(1);
  const [freq, setFreq] = useState("weekly");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [endSelection, setEndSelection] = useState("never");
  const [endDate, setEndDate] = useState(new Date());
  const [count, setCount] = useState(1);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  const handleDayOfWeekChange = (day: number) => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((item) => item !== day));
    } else {
      setWeekDays((weekDays) => [...weekDays, day]);
    }
  };

  const convertDayIdx = (idx: number) => {
    return (((idx - 1) % 7) + 7) % 7;
  };

  const handleSave = () => {
    //alert("submitted");
    alert(interval)
    handleStates(repeat, interval, freq, weekDays, endSelection, endDate, count);
    handleClose();
  };

  return show ? (
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
          <select
            className={styles.dropDown}
            disabled={!repeat}
            value={freq}
            onChange={(e) => setFreq(e.target.value)}
          >
            <option value="weekly">week</option>
            <option value="daily">day</option>
            <option value="monthly">month</option>
          </select>
        </div>

        <p className={styles.smallLabel}>Repeat on</p>
        <div className={styles.dayOfWeekWrapper}>
          {daysOfWeek.map((day, idx) => (
            <div
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
          <button onClick={handleSave} className={styles.saveButton}>
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default RepeatModal;
