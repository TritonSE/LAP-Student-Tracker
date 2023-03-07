import React, { useEffect, useState } from "react";
import styles from "./DayRow.module.css";
import { TimeSlot } from "./TimeSlot";
import { ValidDays } from "../../../models/custom/CustomTypes";
import Button from "@mui/material/Button";

type DayRowProps = {
  times: string[][];
  day: ValidDays;
  setAvailability: (day: ValidDays, times: string[][]) => void;
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
    setAvailabilityTimes((oldAvailability) => {
      oldAvailability.splice(idx, 1);
      return [...oldAvailability];
    });
  };

  // creates a new TimeSlot
  const addTimeSlot = (): void => {
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

      <Button variant={"outlined"} className={styles.modalAddTime} onClick={() => {
        addTimeSlot();
      }}>Add Time</Button>
    </div>
  );
};

export { DayRow };
