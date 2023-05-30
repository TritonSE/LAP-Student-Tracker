import React from "react";
import styles from "./ConnectStudentProfile.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";

type ConnectStudentProfileProps = {
  setShowModalState: (newState: boolean) => void;
  incrementStudent: () => void;
  decrementStudent: () => void;
};

// card to connect a user to the current parent. Main function is to open the modal
export const ConnectStudentProfile: React.FC<ConnectStudentProfileProps> = ({
  setShowModalState,
  incrementStudent,
  decrementStudent,
}) => {
  return (
    <div className={styles.createStudentContainer}>
      <div className={styles.connectStudentContainer}>
        <div className={styles.connectStudentText}> Connect Your Student</div>
        <div>
          <IconButton onClick={() => decrementStudent()}>
            <ArrowBackIcon></ArrowBackIcon>
          </IconButton>
          <IconButton
            onClick={() => {
              incrementStudent();
            }}
          >
            <ArrowForwardIcon></ArrowForwardIcon>
          </IconButton>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div>
          <IconButton
            sx={{
              "& .MuiSvgIcon-fontSizeMedium": {
                width: 80,
                height: 80,
              },
            }}
            size="large"
            color="primary"
            onClick={() => setShowModalState(true)}
          >
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
