import styles from "../../styles/components/LoginViews.module.css";
import React from "react";
import TextField from "@mui/material/TextField";

const cssTextField = {
  color: "black",
  width: 690,
  height: 80,
  "& .MuiFilledInput-input": {
    color: "#000000",
  },
  "& .MuiFormLabel-root": {
    color: "#494C4E",
  },
};

type LoginNameInputProps = {
  onFirstNameChange: (newFirstName: string) => void;
  onLastNameChange: (newLastName: string) => void;
  currFirstName: string;
  currLastName: string;
};

const LoginNameInput: React.FC<LoginNameInputProps> = ({
  onFirstNameChange,
  onLastNameChange,
  currFirstName,
  currLastName,
}) => {
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img src="logo1.png"></img>
          <img src="logo2.png"></img>
        </div>
      </div>
      <div className={styles.nameContainer}>
        <h2 className={styles.title}>What is your name?</h2>
        <TextField
          id="filled-basic"
          value={currFirstName}
          label="First"
          variant="filled"
          type="text"
          color="warning"
          InputProps={{ disableUnderline: true }}
          sx={cssTextField}
          onChange={(e) => onFirstNameChange(e.target.value)}
        />
        <TextField
          id="filled-basic"
          value={currLastName}
          label="Last"
          variant="filled"
          type="text"
          color="warning"
          InputProps={{ disableUnderline: true }}
          sx={cssTextField}
          onChange={(e) => onLastNameChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export { LoginNameInput };
