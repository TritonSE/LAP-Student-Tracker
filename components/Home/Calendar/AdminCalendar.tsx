import React from "react";
import styles from "./CalendarViews.module.css";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useRouter } from "next/router";

// using daygrid plugin to allow time grid plugin to load
const AdminCalendar: React.FC = () => {
  const router = useRouter();
  const _ = dayGridPlugin;
  return (
    <div className={styles.calendarContainer}>
      <Calendar
        initialView="timeGridWeek"
        plugins={[timeGridPlugin]}
        height="85vh"
        slotMinTime="06:00:00"
        slotMaxTime="24:00:00"
        expandRows={true}
        eventSources={[
          {
            url: "/api/event-feed/",
            method: "GET",
            color: "blue",
            textColor: "black",
          },
        ]}
        eventColor="blue"
        eventTextColor="black"
        scrollTime="06:00:00"
        eventClick={(eventClickInfo) => {
          router.push(`/class/${eventClickInfo.event.id}`);
        }}
      />
    </div>
  );
};

export { AdminCalendar };
