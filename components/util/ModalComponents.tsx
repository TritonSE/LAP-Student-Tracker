import React from "react";
import { DialogActions, DialogContent } from "@mui/material";
import styles from "./ModalComponents.module.css";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

type ModalActionsProps = {
  handleSubmit?: () => void;
  handleCancel: () => void;
};

const ModalActions: React.FC<ModalActionsProps> = ({ handleSubmit, handleCancel }) => {
  return (
    <DialogActions>
      <div className={styles.buttonContainer}>
        <Button variant="outlined" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Confirm
        </Button>
      </div>
    </DialogActions>
  );
};

type ModalHeaderProps = {
  title: string;
  description?: string;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, description }) => {
  return (
    <>
      <DialogTitle>
        <div className={styles.title}>{title}</div>
      </DialogTitle>
      {description ? (
        <DialogContent>
          <DialogContentText>
            <div className={styles.description}> {description}</div>
          </DialogContentText>{" "}
        </DialogContent>
      ) : null}
    </>
  );
};

export { ModalHeader, ModalActions };
