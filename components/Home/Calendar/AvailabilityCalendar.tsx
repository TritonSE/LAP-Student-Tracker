import React from "react";
import styles from "./CalendarViews.module.css";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

type AvailabilityCalendarProps = {
  userId: string | undefined;
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ userId }) => {
  const _ = dayGridPlugin;
  if (!userId) {
    return null;
  }
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
            url: "/api/availability-feed/?userId=" + userId,
            method: "GET",
            textColor: "white",
          },
        ]}
        eventColor="blue"
        scrollTime="06:00:00"
      />
    </div>
  );
};

export { AvailabilityCalendar };
