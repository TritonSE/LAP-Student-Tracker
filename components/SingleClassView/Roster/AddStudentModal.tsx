import React, { useContext, useState, useEffect } from "react";
import { APIContext } from "../../../context/APIContext";
import styles from "./roster.module.css";
import {Autocomplete, Modal} from "@mui/material";
import TextField from "@mui/material/TextField";
import useSWR from "swr";
import { User } from "../../../models";

type AddStudentModalProps = {
  showModal: boolean
  handleClose: () => void;
  setRosterChange: (changed: boolean) => void;
  classId: string;
  currentStudents: User[];
};

const AddStudentModal: React.FC<AddStudentModalProps> = ({
    showModal,
  handleClose,
  setRosterChange,
  classId,
  currentStudents,
}) => {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAdd, setConfirmAdd] = useState(false);

  const client = useContext(APIContext);
  const { data: allStudents } = useSWR("/api/users?filter=Student", () =>
    client.getAllUsers("Student")
  );
  const students = allStudents ? allStudents : [];
  const onConfirmClick = (): void => {
    setConfirmAdd(true);
  };

  useEffect(() => {
    const addStudent = async (studentId: string): Promise<void> => {
      let studentAlreadyAdded = false;
      currentStudents.forEach((student) => {
        if (student.id === studentId) studentAlreadyAdded = true;
      });
      if (!studentAlreadyAdded)
        await client.createCommitment(classId, studentId).then(() => setRosterChange(true));
    };

    if (confirmAdd) {
      selectedStudents.forEach((id) => addStudent(id));
      setConfirmAdd(false);
      handleClose();
    }
    setSelectedStudents([]);
  }, [confirmAdd]);

  return (
      <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        <div className={styles.column}>
          {showConfirm ? (
            <>
              <div className={styles.modalTitle}>Are you sure?</div>
              <div className={styles.spacer} />
              <div className={styles.spacer} />
              <div className={styles.spacer} />
              <div className={styles.modalButtonContainer}>
                <button className={styles.cancelButton} onClick={handleClose}>
                  Cancel
                </button>
                <button className={styles.addButton} onClick={() => onConfirmClick()}>
                  Confirm
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.modalTitle}>Add Student</div>
              <div className={styles.spacer} />
              <Autocomplete
                multiple
                limitTags={10}
                id="student-input"
                options={students}
                onChange={(event, value) => setSelectedStudents(value.map((user) => user.id))}
                getOptionLabel={(student) => student.firstName + " " + student.lastName}
                renderInput={(params) => (
                  <TextField {...params} label="Students" placeholder="Students" />
                )}
                isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
                sx={{ width: 435 }}
              />
              <div className={styles.spacer} />
              <div className={styles.modalButtonContainer}>
                <button className={styles.cancelButton} onClick={handleClose}>
                  Cancel
                </button>
                <button className={styles.addButton} onClick={() => setShowConfirm(true)}>
                  Add
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
      </Modal>
  );
};

export { AddStudentModal };
