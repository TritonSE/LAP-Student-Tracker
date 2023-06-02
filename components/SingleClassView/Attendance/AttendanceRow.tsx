import React from "react";
import styles from "./attendance.module.css";
import { AttendanceTypes } from "../../../models";
import Button from "@mui/material/Button";
import { grey } from "@mui/material/colors";

// import { createTheme, ThemeProvider } from "@mui/material/styles";
//
// const theme = createTheme({
//     palette: {
//         an: blue,
//         secondary: yellow
//     }
// });

type AttendanceRowProps = {
  onAttendanceChange: (userId: string, newAttendance: AttendanceTypes) => void;
  name: string;
  userId: string;
  attendance: AttendanceTypes | undefined;
};

const AttendanceRow: React.FC<AttendanceRowProps> = ({
  onAttendanceChange,
  name,
  userId,
  attendance,
}) => {
  return (
    <div className={styles.attendanceRow}>
      <p className={styles.userName}>{name}</p>
      <div className={styles.userAttendance}>
        {attendance == "Present" ? (
          // <Button variant={"contained"} className={styles.presentButton}>Present</Button>

          <Button
            style={{ backgroundColor: "#F5B7B1", color: "#fff" }} // Replace with your desired color
            variant="contained"
            className={styles.baseAttendanceButton}
          >
            {" "}
            Present{" "}
          </Button>
        ) : (
          <Button
            onClick={(_) => onAttendanceChange(userId, "Present")}
            style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
            className={styles.baseAttendanceButton}
            variant="contained"
          >
            Present
          </Button>
        )}
        {attendance == "Excused" ? (
          <Button
            variant="contained"
            style={{ backgroundColor: "#E6BE8A", color: "#fff" }}
            className={styles.baseAttendanceButton}
          >
            Excused
          </Button>
        ) : (
          <Button
            onClick={(_) => onAttendanceChange(userId, "Excused")}
            style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
            className={styles.baseAttendanceButton}
            variant="contained"
            // className={styles.uncheckedButton}
          >
            Excused
          </Button>
        )}
        {attendance == "Unexcused" ? (
          <Button
            variant="contained"
            style={{ backgroundColor: "#B0E0E6", color: "#fff" }}
            className={styles.baseAttendanceButton}
          >
            Unexcused
          </Button>
        ) : (
          <Button
            onClick={(_) => onAttendanceChange(userId, "Unexcused")}
            style={{ backgroundColor: grey[500], color: "#fff" }} // Replace with your desired color
            variant="contained"
            className={styles.baseAttendanceButton}
          >
            Unexcused
          </Button>
        )}
      </div>
    </div>
  );
};
export { AttendanceRow };
