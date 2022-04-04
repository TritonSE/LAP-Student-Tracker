import React from "react";
import styles from "./CalendarViews.module.css";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

type UserCalendarProp = {
  userId: string | undefined;
};

// using daygrid plugin to allow time grid plugin to load
const UserCalendar: React.FC<UserCalendarProp> = ({ userId }) => {
  const _ = dayGridPlugin;

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        initialView="timeGridWeek"
        plugins={[timeGridPlugin]}
        height="84vh"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        eventSources={[
          {
            url: `/api/event-feed/?userId=${userId}`,
            method: "GET",
            color: "blue",
            textColor: "black",
          },
        ]}
        eventColor="blue"
        eventTextColor="black"
      />
    </div>
  );
};

export { UserCalendar };
