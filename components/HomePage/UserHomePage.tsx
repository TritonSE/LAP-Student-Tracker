import React, { useState, useContext } from "react";
import { UserCalendar } from "../Calendar/UserCalendar";
import { AvailabilityModal } from "../ManageAvailabilityWizard/AvailabilityModal";
import styles from "./AdminHomePage.module.css"; //TODO change to user specific
import useSWR from "swr";
import { Loader } from "../util/Loader";
import { Error } from "../util/Error";
import { APIContext } from "../../context/APIContext";
import { DateTime } from "luxon";

type UserHomeProp = {
  userId: string;
};

type Availability = {
  [day:string]: string[][],
  "Mon" : string[][],
  "Tue" : string[][],
  "Wed" : string[][],
  "Thu" : string[][],
  "Fri" : string[][],
  "Sat" : string[][],
}

const UserHomePage: React.FC<UserHomeProp> = ({ userId }) => {
  const [showManageAvailability, setShowManageAvailability] = useState(false);
  const client = useContext(APIContext);
  const { data, mutate, error } = useSWR(`api/availability/${userId}`, () => client.getAvailabilities(userId));
  if (error) return <Error />;
  if (!data) return <Loader />;

  console.log("loaded: ", data)



  const handleClose = (): void => {
    setShowManageAvailability(false);
  };


  const convertToTimeZone = (availability: Availability, currTimeZone:string, timeZone:string): Availability => {
    const dummyDate = {year: 2000, month:1, day:2}
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    let result:Availability = {
      "Mon": [],
      "Tue": [],
      "Wed": [],
      "Thu": [],
      "Fri": [],
      "Sat": [],
      "Sun": [],
    }
    //loops through each time in availabilities
    for(const [day, times] of Object.entries(availability)){
      //loops through each time interval for the day
      for(const time of times){
        const startTime = time[0]
        const endTime = time[1]
        const startDateTime = DateTime.fromObject(
          {...dummyDate, 
           hour:parseInt(startTime.split(":")[0]), 
           minute:parseInt(startTime.split(":")[1])
          }, {zone: timeZone})
        const endDateTime = DateTime.fromObject(
          {...dummyDate, 
            hour:parseInt(endTime.split(":")[0]), 
            minute:parseInt(endTime.split(":")[1])
          }, {zone: timeZone})
        
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
          result[nextDay].push([newStartTime, newEndTime])

        } else if (newStart.day == startDateTime.day && newEnd.day > endDateTime.day) {
          // part of time slot shifted to next day
          result[day].push([newStartTime, "23:59"])
          result[nextDay].push(["00:00", newEndTime])
        } else if (newEnd.day < endDateTime.day) {
          // whole time slot was shifted to previous day
          result[prevDay].push([newStartTime, newEndTime])
        } else if (newEnd.day == endDateTime.day && newStart.day < startDateTime.day) {
          // part of time slot shifted to previous day
          result[day].push(["00:00", newEndTime])
          result[prevDay].push([newStartTime, "23:59"])
        } else {
          // no day shift
          result[day].push([newStartTime, newEndTime])
        }
      }
    }
    delete result["Sun"]
    return result
  };

  let availability = {
    "Mon": (data.mon == null) ? [] : data.mon,
    "Tue": (data.tue == null) ? [] : data.tue,
    "Wed": (data.wed == null) ? [] : data.wed,
    "Thu": (data.thu == null) ? [] : data.thu,
    "Fri": (data.fri == null) ? [] : data.fri,
    "Sat": (data.sat == null) ? [] : data.sat,
  }
  const timeZone = data.timeZone

  // convert timeZones if current timezone different from the one in database
  const currTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (currTimeZone != timeZone){
    availability = convertToTimeZone(availability, currTimeZone, timeZone)
  }




  return (
    <div>
      <div className={styles.homeWrapper}>
        <button className={styles.createBtn} onClick={() => setShowManageAvailability(true)}>
          Manage
          <img className={styles.addIcon} src="AddIcon.png" />
        </button>
        {showManageAvailability ? 
        <AvailabilityModal 
          handleClose={handleClose} 
          initAvailability={availability}
          initTimeZone={currTimeZone}
          userId = {userId}
          mutate = {mutate}
        /> : null}
      </div>
      
      <UserCalendar userId={userId} />
    </div>

    
  );
};

export { UserHomePage };
