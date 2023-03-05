import styles from "./LoginViews.module.css";
import React from "react";
import { Roles } from "../../models";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currPosition}
            label="Role"
            onChange={(event) => {
              onContentChange(event.target.value as Roles);
            }}
          >
            <MenuItem value={"Admin"}>Admin</MenuItem>
            <MenuItem value={"Parent"}>Parent</MenuItem>
            <MenuItem value={"Student"}>Student</MenuItem>
            <MenuItem value={"Teacher"}>Teacher</MenuItem>
            <MenuItem value={"Volunteer"}>Volunteer</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};

export { LoginPositionInput };
