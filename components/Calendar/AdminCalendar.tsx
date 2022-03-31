import React from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

const AdminCalendar: React.FC<object> = () => {
  const _ = dayGridPlugin;
  return (
    <Calendar
      initialView="timeGridWeek"
      plugins={[timeGridPlugin]}
      height="100%"
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
    />
  );
};

export { AdminCalendar };
