import React, { useState, useEffect } from "react";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./TimeSlot.module.css";
import TextField from "@mui/material/TextField";
import { DateTime } from "luxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import IconButton from "@mui/material/IconButton";

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
  const convertTime = (timeStr: string): DateTime => {
    return DateTime.fromFormat(timeStr, "HH:mm");
  };
  // renders a time slot component
  const [startTime, setStartTime] = useState(convertTime(initStartTime));
  const [endTime, setEndTime] = useState(convertTime(initEndTime));

  // calls function to update parent's state
  useEffect(() => {
    const convertedStartTime = startTime.toFormat("HH:mm");
    const convertedEndTime = endTime.toFormat("HH:mm");
    changeTime(index, convertedStartTime, convertedEndTime);
  }, [startTime, endTime]);

  return (
    <div className={styles.timeContainer}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DesktopTimePicker
          onChange={(newTime) => {
            if (newTime != null) {
              setStartTime(newTime);
            }
          }}
          value={startTime}
          renderInput={(params) => <TextField {...params} />}
        />
        <span className={styles.dash} />
        <DesktopTimePicker
          onChange={(newTime) => {
            if (newTime != null) {
              setEndTime(newTime);
            }
          }}
          value={endTime}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>

      <IconButton onClick={() => deleteTimeSlot(index)}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export { TimeSlot };
