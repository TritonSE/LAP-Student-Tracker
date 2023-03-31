import React, { useContext, useState } from "react";
import style from "./ClassCard.module.css";
import { RRule } from "rrule";
import { DateTime } from "luxon";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { APIContext } from "../../../context/APIContext";
import Link from "next/link";
import { EditEventModal } from "./EditEventModal";
import { UpdateEvent } from "../../../models";
import {ConfirmDeleteModal} from "./ConfirmDeleteModal";

type HomePageClassCard = {
  showEditButtons: boolean;
  eventInformationId: string;
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
  refreshClassList: () => Promise<void>;
};

const ClassCard: React.FC<HomePageClassCard> = ({
  showEditButtons,
  eventInformationId,
  name,
  minLevel,
  maxLevel,
  rrstring,
  startTime,
  endTime,
  teachers,
  refreshClassList,
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
  const options = ["Delete", "Edit Name"];

  const rule = RRule.fromString(rrstring);
  const dates = rule.options.byweekday
    .sort()
    .map((val) => weekday[val])
    .join(", ");
  const teacherNames = teachers.map((val) => val.firstName + " " + val.lastName);

  //this takes in the start and end times, converts them to ISO format, then outputs the hour the class starts and ends
  const convertTime = (timeStart: string, timeEnd: string): string => {
    const startTimeISO = DateTime.fromISO(timeStart).toLocal().toFormat("h:mm");
    const endTimeISO = DateTime.fromISO(timeEnd).toLocal().toFormat("h:mma");
    const finalTimes = startTimeISO + " - " + endTimeISO;
    return finalTimes + "";
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (): void => {
    setAnchorEl(null);
  };


  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)

  const onEventEdit = (): void => {
    handleClose();
    setShowEventModal(true);
  };

  const closeEventModal = (): void => {
    setShowEventModal(false);
  };

  const onShowDeleteConfirmModal = (): void => {
    handleClose()
    setShowDeleteConfirmModal(true)
  }

  const saveChanges = async (newName: string): Promise<void> => {
    const updateEvent: UpdateEvent = {
      name: newName,
    };

    await client.updateEvent(eventInformationId, updateEvent);
    await refreshClassList();
  };

  return (
    <div>
      {showEventModal ? (
        <EditEventModal
          modalOpen={true}
          closeModal={closeEventModal}
          saveChanges={saveChanges}
        ></EditEventModal>
      ) : null}
      { showDeleteConfirmModal ? (
          <ConfirmDeleteModal classId={eventInformationId} refreshClasses={refreshClassList} closeModal={() => setShowDeleteConfirmModal(false)} modalOpen={showDeleteConfirmModal}></ConfirmDeleteModal>
      ): null}
      <div className={style.card}>
        <div className={style.title}>
          <div className={style.titleSpacing} />
          <Link href={`/class/${eventInformationId}`}>
            <a className={style.classTitle}>
              {`${name}
        ${minLevel === maxLevel ? minLevel : minLevel + "-" + maxLevel}`}
            </a>
          </Link>
        </div>
        <div className={style.titleTeacherSpacing} />
        <div className={style.name}>{teacherNames.join(", ")}</div>
        <div className={style.times}>{[dates, "•", convertTime(startTime, endTime)].join(" ")}</div>
      </div>
      {showEditButtons ? (
        <>
          <IconButton
            size="small"
            color="default"
            style={{
              left: 260,
              bottom: 143,
            }}
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            {" "}
            <MoreVertIcon />{" "}
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: "20ch",
              },
            }}
          >
            {options.map((option) =>
              option == "Delete" ? (
                <MenuItem
                  key={option}
                  selected={option === "Delete"}
                  onClick={() => {onShowDeleteConfirmModal()}}
                >
                  {option}
                </MenuItem>
              ) : (
                <MenuItem
                  key={option}
                  selected={option === "Edit Name"}
                  onClick={() => onEventEdit()}
                >
                  {option}
                </MenuItem>
              )
            )}
          </Menu>
        </>
      ) : null}
    </div>
  );
};

export { ClassCard };
