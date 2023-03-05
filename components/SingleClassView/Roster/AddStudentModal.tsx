import React, { useContext, useState, useEffect } from "react";
import { APIContext } from "../../../context/APIContext";
import {Autocomplete, Dialog, DialogContent} from "@mui/material";
import TextField from "@mui/material/TextField";
import useSWR from "swr";
import { User } from "../../../models";
import {ModalActions, ModalHeader} from "../../util/ModalComponents";

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
  const client = useContext(APIContext);
  const { data: allStudents } = useSWR("/api/users?filter=Student", () =>
    client.getAllUsers("Student")
  );
  const students = allStudents ? allStudents : [];
  const onConfirmClick = async ():Promise<void> => {
    for (const id in selectedStudents) {
      await addStudent(id);
    }
    handleClose();
  };

  const addStudent = async (studentId: string): Promise<void> => {
    let studentAlreadyAdded = false;
    currentStudents.forEach((student) => {
      if (student.id === studentId) studentAlreadyAdded = true;
    });
    if (!studentAlreadyAdded)
      await client.createCommitment(classId, studentId).then(() => setRosterChange(true));
  };


  return (

      <Dialog PaperProps={{
        style: { borderRadius: 10, width: 500}
      }} open={showModal} onClose={handleClose}>
        {showConfirm ? (
            <>
            <ModalHeader title={"Are you sure?"}/>
            <ModalActions handleSubmit={onConfirmClick} handleCancel={onConfirmClick}/>
            </>
        ): <>
          <ModalHeader title={"Add Students"}/>
            <DialogContent>
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
            </DialogContent>
          <ModalActions handleSubmit={() => setShowConfirm(true)} handleCancel={handleClose}/>
        </>}
      </Dialog>
  );
};

export { AddStudentModal };
