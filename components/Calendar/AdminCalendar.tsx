import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const AdminCalendar: React.FC<any> = () => { 
  // The following code does not retreive the events, and when you refresh the home page, a reference error is produced.
  return (
    <div>
      <FullCalendar 
        defaultView="dayGridWeek" 
        plugins={[ dayGridPlugin ]}
        height='auto'
        eventSources={[
          {
            url: '/api/event-feed/?start=2022-03-10 21:11:45-08&end=2022-04-28 21:11:45-08', // Have not added dynamic dates yet
            method: 'GET',
            color: 'blue',
            textColor: 'black',
          },
        ]}
        eventColor="blue"
        eventTextColor="black"
      />
    </div>
  );

  // The following code does work
  /*return (
    <div>
      <FullCalendar 
        defaultView="dayGridWeek" 
        plugins={[ dayGridPlugin ]}
        height='auto'
        events={[
          {
            title: 'event1',
            allDay: true,
            start: '2022-03-10',
            end: '2022-03-11',
          },
        ]}
        eventColor="blue"
        eventTextColor="black"
      />
    </div>
  );*/
}

export { AdminCalendar };