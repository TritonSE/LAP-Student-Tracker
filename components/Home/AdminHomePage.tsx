import React, { useContext, useEffect, useState } from "react";
import { AdminCalendar } from "./Calendar/AdminCalendar";
import { EventsView } from "./EventsView/EventsView";
import homePageStyles from "./OveralHomePage.module.css";
import { CreateOptions } from "./CreateOptions/CreateOptions";
import { CreateClassWizard } from "./CreateClassWizard/CreateClassWizard";
import { CreateEventWizard } from "./CreateEventWizard/CreateEventWizard";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { AvailabilityCalendar } from "./Calendar/AvailabilityCalendar";

const AdminHomePage: React.FC<object> = () => {
  const [showClassWizard, setShowClassWizard] = useState(false);
  const [showEventWizard, setShowEventWizard] = useState(false);
  const [showManageClassesView, setShowManageClassesViewView] = useState(false);
  const [showMainScreenButtons, setShowMainScreenButtons] = useState(true);
  const [calendar, setCalendar] = useState<string>("full");
  const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>(undefined);

  const client = useContext(APIContext);

  // get all teachers in order to select them in the dropdown
  const { data: allTeachers, error: fetchTeacherError } = useSWR("/api/users?filter=Teacher", () =>
    client.getAllUsers("Teacher")
  );

  // handles changing calendar from full schedule to just availability
  const handleCalendar = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ): void => {
    if (newAlignment != null) {
      setCalendar(newAlignment);
    }
  };

  // handles the change in selected teacher
  const handleTeacherChange = (event: SelectChangeEvent): void => {
    setSelectedTeacher(event.target.value as string);
  };

  const handleClose = (): void => {
    setShowClassWizard(false);
    setShowEventWizard(false);
  };

  // make teachers a list of menu items, to be selectable by MUI's select component
  const teachers = allTeachers
    ? allTeachers.map((teacher) => (
        <MenuItem key={teacher.id} value={teacher.id}>
          {teacher.firstName + teacher.lastName}
        </MenuItem>
      ))
    : [];

  useEffect(() => {
    setShowMainScreenButtons(!showManageClassesView);
  }, [showManageClassesView]);

  return (
    <div className={homePageStyles.homeWrapper}>
      {showMainScreenButtons && (
        <div>
          <div className={homePageStyles.buttonWrapper}>
            <div className={homePageStyles.createBtnWrapper}>
              <CreateOptions
                handleClickClass={setShowClassWizard}
                handleClickOneOffEvent={setShowEventWizard}
              />
            </div>
            <button
              className={homePageStyles.manageBtn}
              onClick={() => setShowManageClassesViewView(true)}
            >
              {<div style={{ color: "white" }}>Manage Classes</div>}
            </button>
            <div className={homePageStyles.availabilitySpacing}></div>
            <div>
              <ToggleButtonGroup
                value={calendar}
                exclusive
                onChange={handleCalendar}
                size="small"
                color="primary"
                aria-label="text alignment"
                sx={{
                  width: 300,
                }}
              >
                <ToggleButton value="full" aria-label="left aligned">
                  Full Schedule
                </ToggleButton>
                <ToggleButton value="availability" aria-label="centered">
                  Availability
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            {/*show teacher selecting input if availability is selected and no error is seen*/}
            {calendar == "availability" ? (
              fetchTeacherError ? (
                "System Error"
              ) : (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedTeacher}
                  label="Age"
                  onChange={handleTeacherChange}
                  sx={{
                    width: 500,
                  }}
                >
                  {teachers}
                </Select>
              )
            ) : null}
          </div>
        </div>
      )}
      {showClassWizard ? <CreateClassWizard handleClose={handleClose} /> : null}
      {showEventWizard ? <CreateEventWizard handleClose={handleClose} /> : null}

      {showManageClassesView ? (
        <EventsView setShowEventsViewPage={setShowManageClassesViewView} />
      ) : calendar == "full" ? (
        <AdminCalendar />
      ) : (
        <AvailabilityCalendar userId={selectedTeacher} />
      )}
    </div>
  );
};

export { AdminHomePage };
