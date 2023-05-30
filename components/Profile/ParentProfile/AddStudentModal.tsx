import React, { useState } from "react";
import styles from "./AddStudentModal.module.css";
import TextField from "@mui/material/TextField";
import { Dialog, DialogContent } from "@mui/material";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";

type AddStudentModalProps = {
  showModal: boolean;
  setShowModalState: (newState: boolean) => void;
  linkParentAndStudent: (studentEmail: string) => Promise<void>;
  errorMsg: string;
};
// modal to add students
export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  setShowModalState,
  linkParentAndStudent,
  errorMsg,
  showModal,
}) => {
  const [studentEmail, setStudentEmail] = useState("");

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 10, width: 450 },
      }}
      open={showModal}
      onClose={() => setShowModalState(false)}
    >
      <ModalHeader title={"Add Your Student's Email"} />

      <DialogContent>
        <TextField
          onChange={(e) => setStudentEmail(e.target.value)}
          className={styles.input}
          id="standard-basic"
          variant="standard"
        />
        <div className={styles.errorMsg}>{errorMsg != "" ? "Error: " + errorMsg : ""}</div>
      </DialogContent>
      <ModalActions
        handleCancel={() => setShowModalState(false)}
        handleSubmit={async () => {
          await linkParentAndStudent(studentEmail);
          return;
        }}
      />
    </Dialog>
  );
};
