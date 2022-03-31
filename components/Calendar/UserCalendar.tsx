import React from "react";
import Calendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

type UserCalendarProp = {
  userId: string | undefined;
};

const UserCalendar: React.FC<UserCalendarProp> = ({ userId }) => {
  const _ = dayGridPlugin;

  return (
    <Calendar
      initialView="timeGridWeek"
      plugins={[timeGridPlugin]}
      height="auto"
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
  );
};

export { UserCalendar };
