import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import { CreateOneOffEvent, User } from "../../../models";
import { DateTime } from "luxon";
import { CirclePicker } from "react-color";
import { ColorResult } from "react-color/index";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import useSWR from "swr";
import styles from "./CreateEventWizard.module.css";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import TextField from "@mui/material/TextField";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { Autocomplete } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { CustomLoader } from "../../util/CustomLoader";

type CreateEventWizardProps = {
  handleClose: () => void;
};

type Attendee = {
  role: string;
  userId: string;
};

const CreateEventWizard: React.FC<CreateEventWizardProps> = ({ handleClose }) => {
  const { user: currUser } = useContext(AuthContext);

  if (currUser == null) {
    return <CustomLoader />;
  }
  // create wizard states
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<DateTime>(DateTime.fromJSDate(new Date()));
  const [startTime, setStartTime] = useState<DateTime | null>(null);
  const [endTime, setEndTime] = useState<DateTime | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#ffc702");

  // selected attendees from dropdown (string of emails)
  const [selectedAttendees, setSelectedAttendees] = useState<User[]>([]);
  const [ignoreAvailabilities, setIgnoreAvailabilities] = useState(false);

  const [valid, setValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  // get all teachers in order to select them in the dropdown
  const { data: allUsers, error: fetchUsersError } = useSWR("/api/users", () =>
    client.getAllUsers(undefined, true)
  );

  // since all teachers can be undefined, check here and use an empty array if it is
  const users = allUsers ? allUsers.filter((user) => user.id != currUser.id) : [];

  const client = useContext(APIContext);

  const colorMap: { [name: string]: string } = {
    "#ffc702": "yellow",
    "#ef5da8": "magenta",
    "#46d5b3": "mint",
    "#5d5fef": "purple",
    "#5ec0f0": "blue",
    "#ff0202": "red",
  };

  // validates event wizard fields on state change
  const nameValid = name != "";
  const attendeesValid = selectedAttendees.length > 0;
  const startDateValid = startDate != null;
  const startTimeValid = startTime != null;
  const endTimeValid = endTime != null;
  const startBeforeEndTime = startTimeValid && endTimeValid && startTime < endTime;

  useEffect(() => {
    setValid(
      nameValid &&
        attendeesValid &&
        startDateValid &&
        startTimeValid &&
        endTimeValid &&
        startBeforeEndTime
    );
    const errorMessage = fetchUsersError
      ? fetchUsersError.message
      : !nameValid
      ? "Please enter a name for the event"
      : !attendeesValid
      ? "Please enter at least one attendee"
      : !startDateValid
      ? "Please enter a valid start date"
      : !startTimeValid
      ? "Please enter a valid start/end time"
      : !endTimeValid
      ? "Please enter a valid end time"
      : !startBeforeEndTime
      ? "Please ensure that the start time is before the end time"
      : "";
    setErrMsg(errorMessage);
  }, [nameValid, attendeesValid, startDateValid, startTimeValid, endTimeValid, startBeforeEndTime]);

  // handles create wizard submit
  const handleSubmit = async (): Promise<void> => {
    setErrMsg("");
    setLoading(true);

    // this can never be true, but done to appease typechecking
    if (startTime == null || endTime == null) {
      return;
    }

    const attendees = [];
    for (const user of selectedAttendees) {
      const attendee: Attendee = {
        role: user.role,
        userId: user.id,
      };
      attendees.push(attendee);
    }

    const createEvent: CreateOneOffEvent = {
      name: name,
      start: startDate.set({ hour: startTime.hour, minute: startTime.minute }).toISO(),
      end: startDate.set({ hour: endTime.hour, minute: endTime.minute }).toISO(),
      color: colorMap[color],
      attendees: attendees,
      checkAvailabilities: !ignoreAvailabilities,
    };

    try {
      // Create class event and calendar information
      await client.createOneOffEvent(createEvent);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) setErrMsg(err.response.data);
      else if (err instanceof Error) setErrMsg(err.message);
      else setErrMsg("Error");
      setLoading(false);
      return;
    }

    setLoading(false);
    handleClose();
  };

  return (
    <>
      <div className={styles.wizardWrapper}>
        <div className={styles.wizardContent}>
          <div className={styles.headerContent}>
            <div className={styles.titleWrapper}>
              <img onClick={handleClose} className={styles.closeIcon} src="CloseIcon.png" />
              <p className={styles.title}>Create Event</p>
              <div className={styles.padding} />
            </div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Java Bear"
            />
          </div>

          <div className={styles.scrollableContent}>
            <div className={styles.row}>
              <img className={styles.timeIcon} src="TimeIcon.png" />
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <div className={styles.datePickerContainer}>
                  <DesktopDatePicker
                    inputFormat="DD"
                    className={styles.dateInput}
                    value={startDate}
                    onChange={(newDate) => {
                      setStartDate(newDate ? newDate : startDate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className={styles.timePickerContainer}>
                  <DesktopTimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newTime) => {
                      setStartTime(newTime);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
                <div className={styles.timePickerContainer}>
                  <DesktopTimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newTime) => {
                      setEndTime(newTime);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </div>
              </LocalizationProvider>
              <div className={styles.dropDownWrapper}>
                <div
                  className={styles.dropDown}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <span className={styles.colorCircle} style={{ background: color }} />
                  <span className={styles.arrow} />
                </div>
                {showColorPicker ? (
                  <div className={styles.popover}>
                    <div className={styles.cover} onClick={() => setShowColorPicker(false)} />
                    <CirclePicker
                      width={80}
                      height={136}
                      colors={Object.keys(colorMap)}
                      hex={color}
                      onChange={(c: ColorResult) => setColor(c.hex)}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className={styles.row}>
              <img className={styles.teacherIcon} src="TeacherIcon.png" />
              <div className={styles.spacing} />
              <Autocomplete
                multiple
                limitTags={5}
                id="teacher-input"
                options={users}
                onChange={(event, value) => setSelectedAttendees(value)}
                getOptionLabel={(attendee) => attendee.firstName + " " + attendee.lastName}
                renderInput={(params) => (
                  <TextField {...params} label="Attendees" placeholder="Attendees" />
                )}
                isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
                sx={{ width: 750, zIndex: 0 }}
              />
            </div>

            <div className={styles.availabilityWrapper}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={ignoreAvailabilities}
                onChange={() => setIgnoreAvailabilities(!ignoreAvailabilities)}
              />
              <label className={styles.availabilityCheckLabel}>
                Override teacher availabilities
              </label>
            </div>
          </div>

          <hr className={styles.line} />
          <div className={styles.footerContent}>
            <button
              disabled={!valid || loading}
              onClick={handleSubmit}
              className={styles.confirmButton}
            >
              {loading ? <ClipLoader loading={true} size={30} color={"white"} /> : "Confirm"}
            </button>
            <div className={styles.errorMsg}>{errMsg}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export { CreateEventWizard };
