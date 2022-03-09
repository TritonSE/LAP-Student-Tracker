import React, { useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const UserCalendar: React.FC<any> = ({ userId }) => {
  
  return (
    <div>
      <FullCalendar 
        defaultView="dayGridWeek" 
        plugins={[ dayGridPlugin ]}
        height='auto'
        eventSources={[
          {
            url: `/api/event-feed/?start=2022-03-06 21:11:45-08&end=2022-04-28 21:11:45-08&userId=${userId}`,
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
}

export { UserCalendar };