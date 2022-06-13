import React, { useContext } from "react";
import style from "./ClassCard.module.css";
import { RRule } from "rrule";
import { DateTime } from "luxon";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { deleteClassEvent } from "../../../lib/database/events";
import { string } from "fp-ts";
import { APIContext } from "../../../context/APIContext";
import useSWR from "swr";


type HomePageClassCard = {
  id: string;
  name: string;
  minLevel: number;
  maxLevel: number;
  rrstring: string;
  startTime: string;
  endTime: string;
  teachers: {
    userId: string;
    firstName: string;
    lastName: string;
  }[];
};

const ClassCard: React.FC<HomePageClassCard> = ({
  id,
  name,
  minLevel,
  maxLevel,
  rrstring,
  startTime,
  endTime,
  teachers,
}) => {
  const client = useContext(APIContext);
  const weekday: string[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const options = [
    'Delete'
  ];

  const rule = RRule.fromString(rrstring);
  const dates = rule.options.byweekday.sort().map((val) => weekday[val]).join(", ");
  const teacherNames = teachers.map((val) => val.firstName +  " " + val.lastName);

  //this takes in the start and end times, converts them to ISO format, then outputs the hour the class starts and ends
  const convertTime = (timeStart: string, timeEnd: string): string => {
    const startTimeISO = DateTime.fromISO(timeStart).toLocal().toFormat("h:mm");
    const endTimeISO = DateTime.fromISO(timeEnd).toLocal().toFormat("h:mma");
    const finalTimes = startTimeISO + " - " + endTimeISO;
    return finalTimes + "";
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteBut = () => {
    setAnchorEl(null);
    const { data, error } = useSWR("/api/class", () => client.deleteClassEvent("5"));
    //deleteClassEvent(id);

    
  };


  return (
    <div>
    <div className={style.card}>
        <div className={style.title}>
          <div className={style.titleSpacing}/>
          
          <a className={style.classTitle} href="components/Home/EventsView/ClassCard">
            {`${name}
        ${minLevel === maxLevel ? minLevel : minLevel + "-" + maxLevel}`}
          </a>
        </div>
      <div className={style.titleTeacherSpacing}/>
      <div className={style.name}>{teacherNames.join(", ")}</div>
      <div className={style.times}>{[dates, "•", convertTime(startTime, endTime)].join(" ")}</div>
    </div>

    <IconButton size="small" color="default" style={{
                left: 260,
                bottom: 143,
          }}
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
          > <MoreVertIcon /> </IconButton>
          <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Delete'} onClick={
            deleteBut
            }>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export { ClassCard };
