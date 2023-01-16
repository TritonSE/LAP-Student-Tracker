import React from "react";
import styles from "./ConnectedStudentDisplay.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { User } from "../../../models";

type ConnectedStudentDisplayProps = {
  student: User;
  incrementStudent: () => void;
  decrementStudent: () => void;
};
// displays the linked students to the parent. This is for one student, we use
// an array of these and switch between them in the profile view
export const ConnectedStudentDisplay: React.FC<ConnectedStudentDisplayProps> = ({
  student,
  incrementStudent,
  decrementStudent,
}) => {
  return (
    <div className={styles.currentStudentContainer}>
      <div className={styles.nameAndArrowContainer}>
        <div className={styles.studentsText}>Students</div>
        <div>
          <IconButton onClick={() => decrementStudent()}>
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
          <IconButton onClick={() => incrementStudent()}>
            <ArrowForwardIcon></ArrowForwardIcon>
          </IconButton>
        </div>
      </div>

      <div className={styles.studentInfoContainer}>
        <div className={styles.studentName}> {student.firstName + " " + student.lastName}</div>
        <div className={styles.phoneText}> Phone</div>
        <div className={styles.phoneVal}> {student.phoneNumber ? student.phoneNumber : "None"}</div>
        <div className={styles.phoneText}>Email</div>
        <div className={styles.phoneVal}>{student.email}</div>
      </div>
    </div>
  );
};
