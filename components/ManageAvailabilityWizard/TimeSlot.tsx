/* eslint-disable import/extensions */
import React, { useState, useEffect } from "react";
import styles from "./TimeSlot.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker/dist/entry.nostyle";

type TimeSlotProps = {
  initStartTime: string;
  initEndTime: string;
  changeTime: (idx: number, startTime: string, endTime: string) => void;
  deleteTimeSlot: (idx: number) => void;
  index: number;
};

const TimeSlot: React.FC<TimeSlotProps> = ({
  initStartTime,
  initEndTime,
  changeTime,
  deleteTimeSlot,
  index,
}) => {
  // renders a time slot component
  const [startTime, setStartTime] = useState(initStartTime);
  const [endTime, setEndTime] = useState(initEndTime);

  // calls function to update parent's state
  useEffect(() => {
    changeTime(index, startTime, endTime);
  }, [startTime, endTime]);

  return (
    <div className={styles.timeContainer}>
      <TimePicker
        className={styles.timeInput}
        onChange={setStartTime}
        value={initStartTime}
        clearIcon={null}
        clockIcon={null}
        disableClock={true}
        format="h:mma"
      />
      <span className={styles.dash} />
      <TimePicker
        className={styles.timeInput}
        onChange={setEndTime}
        value={initEndTime}
        clearIcon={null}
        clockIcon={null}
        disableClock={true}
        format="h:mma"
      />
      <div
        className={styles.deleteIcon}
        onClick={() => {
          deleteTimeSlot(index);
        }}
      >
        <img src="trash-can-solid.svg" />
      </div>
    </div>
  );
};

export { TimeSlot };
