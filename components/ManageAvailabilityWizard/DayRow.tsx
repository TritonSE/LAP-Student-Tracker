/* eslint-disable import/extensions */
import React, { useState, useEffect } from "react";
import styles from "./DayRow.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import TimePicker from "react-time-picker/dist/entry.nostyle";
import DatePicker from "react-date-picker/dist/entry.nostyle";

import {TimeSlot} from "./TimeSlot";



type DayRowProps = {
  times: string[][];
  day: string;
  setAvailability: (day:string, times:string[][]) => void
};

const DayRow: React.FC<DayRowProps> = ({
  times,
  day,
  setAvailability, // used for setting availability in the dictionary with all days
}) => {
  const [availabilityTimes, setAvailabilityTimes] = useState(times) // array of times for a single day

  console.log("Day Row: ", day, "times: ", availabilityTimes)

  // function to update time state when TimeSlot component changes a time
  const handleTimeChange = (
    idx: number,
    startTime: string,
    endTime: string
  ): void => {
    // changes the correct index in availabilityTimes
    let currentAvailability = availabilityTimes
    currentAvailability[idx][0] = startTime;
    currentAvailability[idx][1] = endTime;

    setAvailabilityTimes([...currentAvailability])
  }

  // function to delete time from time state when TimeSlot component deleted
  const handleDeleteTime = (
    idx: number,
  ): void => {
    // removed the time array for this day
    let currentAvailability = availabilityTimes
    currentAvailability.splice(idx, 1)
    
    setAvailabilityTimes([...currentAvailability])
  }

  const addTimeSlot = (): void => {
    // creates a new TimeSlot
    let currentAvailability = availabilityTimes
    currentAvailability.push(["12:00","13:00"]) // default start and end times?

    setAvailabilityTimes([...currentAvailability])
  }

  // calls function to update parent's state
  useEffect(() => {
    setAvailability(day, availabilityTimes)
  }, [availabilityTimes])



  return (
    <div className={styles.row}>
      <div className={styles.modalDay}>
        {day}
      </div>

      <div className={styles.timeSlotContainer}>
        {console.log("before rendering", availabilityTimes)}
        {availabilityTimes.map((times, idx) => (
          <TimeSlot 
            initStartTime={times[0]} 
            initEndTime={times[1] } 
            changeTime={handleTimeChange}
            deleteTimeSlot={handleDeleteTime}
            index = {idx}/>
        ))}
        
      </div>

      <div 
      className={styles.modalAddTime}
      onClick={() => {addTimeSlot()}}
      >
        <p>Add Time</p> <span className={styles.modalAddTimePlus}>+</span>
      </div>
    </div>
    
  );
};

export { DayRow };
