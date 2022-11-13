import styles from "./LoginViews.module.css";
import React from "react";
import { Roles } from "../../models";

type LoginPositionInputProps = {
  onContentChange: (newPosition: Roles) => void;
  currPosition: Roles;
};
// handles selecting a role for a new user
const LoginPositionInput: React.FC<LoginPositionInputProps> = ({
  onContentChange,
  currPosition,
}) => {
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src="logo1.png"></img>
          <img src="logo2.png"></img>
        </div>
      </div>
      <div className={styles.positionContainer}>
        <h2 className={styles.title}>Select your position:</h2>
        <form>
          <input
            type="radio"
            id="admin"
            name="select-position"
            value="Admin"
            onChange={(_) => onContentChange("Admin")}
            className={styles.radioBox}
            checked={currPosition == "Admin"}
          />
          <label htmlFor="admin" className={styles.positionText}>
            Admin
          </label>
          <br></br>
          <input
            type="radio"
            id="teacher"
            name="select-position"
            value="Teacher"
            onChange={(_) => onContentChange("Teacher")}
            className={styles.radioBox}
            checked={currPosition == "Teacher"}
          />
          <label htmlFor="teacher" className={styles.positionText}>
            Teacher
          </label>
          <br></br>
          <input
            type="radio"
            id="teacher"
            name="select-position"
            value="Student"
            onChange={(_) => onContentChange("Student")}
            className={styles.radioBox}
            checked={currPosition == "Student"}
          />
          <label htmlFor="student" className={styles.positionText}>
            Student
          </label>
          <br></br>
          <input
            type="radio"
            id="teacher"
            name="select-position"
            value="Volunteer"
            onChange={(_) => onContentChange("Volunteer")}
            className={styles.radioBox}
            checked={currPosition == "Volunteer"}
          />
          <label htmlFor="teacher" className={styles.positionText}>
            Volunteer
          </label>
        </form>
      </div>
    </div>
  );
};

export { LoginPositionInput };
