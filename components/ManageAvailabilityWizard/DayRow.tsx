import React, { useState, useEffect } from "react";
import styles from "./DayRow.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import { TimeSlot } from "./TimeSlot";

type DayRowProps = {
  times: string[][];
  day: string;
  setAvailability: (day: string, times: string[][]) => void;
};

const DayRow: React.FC<DayRowProps> = ({
  times,
  day,
  setAvailability, // used for setting availability in the dictionary with all days
}) => {
  const [availabilityTimes, setAvailabilityTimes] = useState(times); // array of times for a single day

  // function to update time state when TimeSlot component changes a time
  const handleTimeChange = (idx: number, startTime: string, endTime: string): void => {
    // changes the correct index in availabilityTimes

    setAvailabilityTimes((oldAvailability) => {
      oldAvailability[idx][0] = startTime;
      oldAvailability[idx][1] = endTime;
      return [...oldAvailability];
    });
  };

  // function to delete time from time state when TimeSlot component deleted
  const handleDeleteTime = (idx: number): void => {
    // removed the time array for this day

    setAvailabilityTimes((oldAvailability) => {
      oldAvailability.splice(idx, 1);
      const result = [...oldAvailability];
      return result;
    });
  };

  const addTimeSlot = (): void => {
    // creates a new TimeSlot

    setAvailabilityTimes((oldAvailability) => {
      oldAvailability.push(["12:00", "13:00"]);
      return [...oldAvailability];
    });
  };

  // calls function to update parent's state
  useEffect(() => {
    setAvailability(day, availabilityTimes);
  }, [availabilityTimes]);

  return (
    <div className={styles.row}>
      <div className={styles.modalDay}>{day}</div>

      <div className={styles.timeSlotContainer}>
        {availabilityTimes.map((times, idx) => (
          <TimeSlot
            initStartTime={times[0]}
            initEndTime={times[1]}
            changeTime={handleTimeChange}
            deleteTimeSlot={handleDeleteTime}
            index={idx}
            key={idx}
          />
        ))}
      </div>

      <div
        className={styles.modalAddTime}
        onClick={() => {
          addTimeSlot();
        }}
      >
        <p>Add Time</p> <span className={styles.modalAddTimePlus}>+</span>
      </div>
    </div>
  );
};

export { DayRow };
