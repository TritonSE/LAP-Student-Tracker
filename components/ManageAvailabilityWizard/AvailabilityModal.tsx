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
import { Availability } from "../../models/availability";


type AvailabilityModalProps = {
  handleClose: () => void;
  userId: string;
};

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  handleClose,
  userId
}) => {
  // repeat modal states initialized by init props
  const [availability, setAvailability] = useState<Availability>(
    {mon:null,
    tue:null,
    wed:null,
    thu:null,
    fri:null,
    sat:null,
    timeZone:""
  });
  const [loading, setLoading] = useState(false)
  const [valid, setValid] = useState(true)
  const [errMsg, setErrMsg] = useState("")

  const client = useContext(APIContext);
  const { data, mutate, error } = useSWR(`api/availability/${userId}`, () => client.getAvailabilities(userId));

  /*
returns a boolean specifyinh whether times are valid, the day in which a conflict
occurs if time isn't valid, and an error message specifying type of conflict if
time isn't valid
*/
  const areTimesValid = (availability: Availability): [boolean, string, string] => {
    const dummyDate = "2000-01-02 "

    // loops through each day
    for(const [day, allTime] of Object.entries(availability)){
      if (day == "timeZone" || allTime == null) {
        continue
      }
      //makes a deepcopy so we do not change states
      let times = JSON.parse(JSON.stringify(allTime));

      // checks for overlapping times

      times = sortTimes(times);


      for(const time of times){

        let startTime = time[0];
        let endTime = time[1];

        const startDateTime = DateTime.fromFormat(dummyDate + startTime, "y-MM-dd HH:mm")

        const endDateTime = DateTime.fromFormat(dummyDate + endTime, "y-MM-dd HH:mm")



        // check if start time is before the end time
        if (startDateTime >= endDateTime) {
          return [false, day, "Start time must be before end time."]
        }


      }

      // check if there is an overlapping time slot
      for (let i = 1; i < times.length; i++) {
        let prevEndTime = times[i-1][1]
        let currStartTime = times[i][0]


        const prevEndDateTime = DateTime.fromFormat(dummyDate + prevEndTime, "y-MM-dd HH:mm")
        const currStartDateTime = DateTime.fromFormat(dummyDate + currStartTime, "y-MM-dd HH:mm")


        if (prevEndDateTime > currStartDateTime) {
          return [false, day, "Times cannot overlap."]
        }
      }
    }
    return [true, "", ""]
  }

  const sortTimes = (times: string[][]): string[][] => {
    console.log("TIMES", times)
    times.sort((t1:string[], t2:string[])=>{
      if (t1[0] == t2[0]){
        return 0;
      }
      return t1[0] < t2[0] ? -1 : 1;
    })

    return times
  }

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

  if (error) return <Error />;
  if (!data) return <Loader />;
  console.log("LOADED DATA", data)

  

  let availabilityFromDB: Availability = {
    mon: (data.mon == null) ? [] : data.mon,
    tue: (data.tue == null) ? [] : data.tue,
    wed: (data.wed == null) ? [] : data.wed,
    thu: (data.thu == null) ? [] : data.thu,
    fri: (data.fri == null) ? [] : data.fri,
    sat: (data.sat == null) ? [] : data.sat,
    timeZone: data.timeZone
    
  }
  
  let timezone = availabilityFromDB["timeZone"];

  // convert timeZones if current timezone different from the one in database
  const currTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  console.log("timezone in db: ", timezone)
  console.log("current timezone: ", currTimeZone)

  if (currTimeZone != timezone){
    setAvailability( (oldAvailabiliy)=> {
      return convertToTimeZone(oldAvailabiliy, currTimeZone, timezone)
    })
  }



  const convertToTimeZone = (availability: Availability, currTimeZone:string, timeZone:string): Availability => {
    const dummyDate = "2000-01-02 "
    const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    let result:Availability = {
      mon : [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      timeZone: currTimeZone,
    }
    //loops through each time in availabilities
    for(const [key, value] of Object.entries(availability)){
      let day: string;
      let times;
      if (daysOfWeek.includes(key)){
        day = key
        times = value
      }
      //loops through each time interval for the day
      for(const time of times){
        const startTime = time[0]
        const endTime = time[1]
        const startDateTime = DateTime.fromFormat(dummyDate + startTime, "y-MM-dd HH:mm", {zone: timeZone})
        const endDateTime = DateTime.fromFormat(dummyDate + endTime, "y-MM-dd HH:mm", {zone: timeZone})
      
        
        // changes to target time zone
        const newStart = startDateTime.setZone(currTimeZone)
        const newEnd = endDateTime.setZone(currTimeZone)


        const currentDayIndex = daysOfWeek.indexOf(day)

        // gets the next and previous days
        const nextDay = daysOfWeek[((currentDayIndex + 1) + daysOfWeek.length) % daysOfWeek.length]
        const prevDay = daysOfWeek[((currentDayIndex - 1) + daysOfWeek.length) % daysOfWeek.length]
        
        // gets the new time after conversion
        
        const newStartTime = newStart.toFormat("HH:mm")
        const newEndTime = newEnd.toFormat("HH:mm")
        // checks for date shifts
        if (newStart.day > startDateTime.day){
          // whole time slot was shifted to the next day
          if (nextDay != "sun") {
            result[nextDay].push([newStartTime, newEndTime])
          }

        } else if (newStart.day == startDateTime.day && newEnd.day > endDateTime.day) {
          // part of time slot shifted to next day
          result[day].push([newStartTime, "23:59"])
          if (nextDay != "sun") {
            result[nextDay].push(["00:00", newEndTime])
          }
        } else if (newEnd.day < endDateTime.day) {
          // whole time slot was shifted to previous day
          if (prevDay != "sun") {
            result[prevDay].push([newStartTime, newEndTime])
          }
        } else if (newEnd.day == endDateTime.day && newStart.day < startDateTime.day) {
          // part of time slot shifted to previous day
          result[day].push(["00:00", newEndTime])
          if (prevDay != "sun") {
            result[prevDay].push([newStartTime, "23:59"])
          }
        } else {
          // no day shift
          result[day].push([newStartTime, newEndTime])
        }
      }
    }
    return result
  };
  


  const updateAvailabilty = (day: string, times: string[][]): void => {
    // function to update availability state when child component changes times
    setAvailability( (oldAvailability) => {
      
      oldAvailability[day] = times
      return {...oldAvailability}
    })

  }


  // passes state values to callback and closes modal on save
  const handleSubmit = async (): Promise<void> => {
    setLoading(true);

    try {
      // converts empty availabilities to null
      const newAvailability = {
        "mon": !availability["mon"] || availability["mon"].length == 0 ? null : sortTimes(availability["mon"]),
        "tue": !availability["tue"] || availability["tue"].length == 0 ? null : sortTimes(availability["tue"]),
        "wed": !availability["wed"] || availability["wed"].length == 0 ? null : sortTimes(availability["wed"]),
        "thu": !availability["thu"] || availability["thu"].length == 0 ? null : sortTimes(availability["thu"]),
        "fri": !availability["fri"] || availability["fri"].length == 0 ? null : sortTimes(availability["fri"]),
        "sat": !availability["sat"] || availability["sat"].length == 0 ? null : sortTimes(availability["sat"]),
        "timeZone": timezone
      }
      console.log("SUBMIT",newAvailability)
      
      const updateResult = await client.updateAvailabilities(newAvailability, userId);

      console.log("UPDATED RESULT FROM RETURN");
      console.log(updateResult);
      // update the cached data from useSWR
      await mutate(newAvailability);
      
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
            {Object.entries(availabilityFromDB).map((entry)=>(
              entry[0] != "timeZone" ? <DayRow times={entry[1]} day={entry[0]} setAvailability={updateAvailabilty} />: <></>
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
