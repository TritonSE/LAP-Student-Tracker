import React, { useState } from "react";
import styles from "./EditEventModal.module.css";
// import styles from "../../Profile/ParentProfile/AddPeopleModal.module.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type EditEventModalProps = {
  closeModal: () => void;
  saveChanges: (newName: string) => Promise<void>;
  modalOpen: boolean;
};

const EditEventModal: React.FC<EditEventModalProps> = ({ closeModal, saveChanges, modalOpen }) => {
  const [open, setOpen] = useState(modalOpen);
  const [newName, setNewName] = useState("");

  const handleClose = (): void => {
    closeModal();
    setOpen(false);
  };

  const handleSaveChanges = async (): Promise<void> => {
    await saveChanges(newName);
  };

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 10, width: 450 },
      }}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        <div className={styles.title}>Edit Event Name</div>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className={styles.description}> Please enter the new name of this event</div>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          variant="standard"
          onChange={(e) => setNewName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <div className={styles.buttonContainer}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={async () => handleSaveChanges()}>
            Confirm
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export { EditEventModal };
