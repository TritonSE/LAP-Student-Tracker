/* eslint-disable import/extensions */
import React, { useState, useEffect, useContext } from "react";
import styles from "./AvailabilityModal.module.css";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import ClipLoader from "react-spinners/ClipLoader";
import { DayRow } from "./DayRow";
import { DateTime, StringUnitLength} from "luxon";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
import { AuthContext } from "../../context/AuthContext";

type Availability = {
  [Day: string]: string[][];
  
}


type AvailabilityModalProps = {
  handleClose: () => void;
  // handleStates: (availability: Availability, timeZone: string) => void;
  // props for initial state values
  initAvailability: Availability;
  initTimeZone: string;
  userId: string;
  mutate: (availabiliy:any) => void;
};

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  handleClose,
  // handleStates,
  initAvailability,
  initTimeZone,
  userId,
  mutate
}) => {
  // repeat modal states initialized by init props
  const [availability, setAvailability] = useState(initAvailability);
  const [timezone, setTimeZone] = useState(initTimeZone);
  const [loading, setLoading] = useState(false)
  const [valid, setValid] = useState(true)
  const [errMsg, setErrMsg] = useState("")

  const client = useContext(APIContext);

  const sortTimes = (times: string[][]): string[][] => {
    times.sort((t1:string[], t2:string[])=>{
      if (t1[0] == t2[0]){
        return 0;
      }
      return t1[0] < t2[0] ? -1 : 1;
    })

    return times
  }
  
  const areTimesValid = (availability: Availability): [boolean, string, string] => {
    // loops through each day
    for(const [day, allTime] of Object.entries(availability)){
      //makes a deepcopy so we do not change states
      let times = JSON.parse(JSON.stringify(allTime));

      // checks for overlapping times

      times = sortTimes(times);


      for(const time of times){
        
        let startTime = time[0];
        let endTime = time[1];

        //pad 0 in front of time if before 10am
        if(startTime.length < 5){
          startTime = "0" + startTime;
        }
        if(endTime.length < 5){
          endTime = "0" + endTime;
        }

        // check if start time is before the end time
        if (startTime >= endTime) {
          return [false, day, "Start time must be before end time."]
        }


      }

      // check if there is an overlapping time slot
      for (let i = 1; i < times.length; i++) {
        let prevEndTime = times[i-1][1]
        let currStartTime = times[i][0]

        //pad 0 in front of time if before 10am
        if(currStartTime.length < 5){
          currStartTime = "0" + currStartTime;
        }
        if(prevEndTime.length < 5){
          prevEndTime = "0" + prevEndTime;
        }

        if (prevEndTime > currStartTime) {
          console.log(prevEndTime, currStartTime)
          return [false, day, "Times cannot overlap."]
        }
      }
    }
    return [true, "", ""]
  }

  const updateAvailabilty = (day: string, times: string[][]): void => {
    // function to update availability state when child component changes times
    let newAvailability: Availability = availability;
    newAvailability[day] = times;

    setAvailability({...newAvailability});

  }


  // passes state values to callback and closes modal on save
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    // TODO set states and make backend request

    try {
      // converts empty availabilities to null
      const newAvailability = {
        "mon": availability["Mon"].length == 0 ? null : sortTimes(availability["Mon"]),
        "tue": availability["Tue"].length == 0 ? null : sortTimes(availability["Tue"]),
        "wed": availability["Wed"].length == 0 ? null : sortTimes(availability["Wed"]),
        "thu": availability["Thu"].length == 0 ? null : sortTimes(availability["Thu"]),
        "fri": availability["Fri"].length == 0 ? null : sortTimes(availability["Fri"]),
        "sat": availability["Sat"].length == 0 ? null : sortTimes(availability["Sat"]),
        "timeZone": timezone
      }
      const classEvent = await client.updateAvailabilities(newAvailability, userId);
      // update the cached data from useSWR
      mutate(newAvailability)
      
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) setErrMsg(err.response.data);
      else if (err instanceof Error) setErrMsg(err.message);
      else setErrMsg("Error");
      setLoading(false);
      return;
    }

    setLoading(false);
    handleClose();
  };


  // updates the valid state everytime Availabilities change
  useEffect(() => {
    // checks if all time slots are valid
    let [isValid, day, errorMsg] = areTimesValid(availability);
    setValid(isValid);

    if (!isValid){
      // sets error message if timeslot not valid
      setErrMsg(errorMsg + " Check your times for " + day);
    } else {
      // otherwise remove error message
      setErrMsg("");
    }
  }, [availability])

  

  return (
    <div className={styles.wizardWrapper}>
        <div className={styles.wizardContent}>
          <div className={styles.headerContent}>
            <div className={styles.titleWrapper}>
              <img onClick={handleClose} className={styles.closeIcon} src="CloseIcon.png" />
              <p className={styles.title}>Manage Availability</p>
              <div className={styles.padding} />
            </div>
            
          </div>

          <div className={styles.availabilityContainer}>
            {Object.entries(availability).map((entry)=>(
              <DayRow times={entry[1]} day={entry[0]} setAvailability={updateAvailabilty} />
            ))}
            
            
          </div>

          <hr className={styles.line} />
          <div className={styles.footerContent}>
            <button
              disabled={!valid || loading}
              onClick={handleSubmit}
              className={styles.confirmButton}
            >
              {loading ? <ClipLoader loading={true} size={30} color={"white"} /> : "Confirm"}
            </button>
            <div className={styles.errorMsg}>{errMsg}</div>
          </div>
        </div>
      </div>
  );
};

export { AvailabilityModal };
