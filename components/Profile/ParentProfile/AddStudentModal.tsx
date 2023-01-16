import React, { useState } from "react";
import styles from "./AddStudentModal.module.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

type AddStudentModalProps = {
  setShowModalState: (newState: boolean) => void;
  linkParentAndStudent: (studentEmail: string) => Promise<void>;
  errorMsg: string;
};
export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  setShowModalState,
  linkParentAndStudent,
  errorMsg,
}) => {
  const [studentEmail, setStudentEmail] = useState("");

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalContainerInside}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <div className={styles.textStyle}>Enter Your Student's Email:</div>

        <TextField
          onChange={(e) => setStudentEmail(e.target.value)}
          className={styles.input}
          id="standard-basic"
          variant="standard"
        />
        <div className={styles.textButtonSpacing}></div>
        <div className={styles.modalButtonContainer}>
          <Button
            className={styles.button}
            onClick={() => setShowModalState(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            className={styles.button}
            onClick={async () => {
              await linkParentAndStudent(studentEmail);
            }}
            variant="contained"
          >
            Submit
          </Button>
        </div>
        <div className={styles.errorMsg}>{errorMsg != "" ? "Error: " + errorMsg : ""}</div>
      </div>
    </div>
  );
};
