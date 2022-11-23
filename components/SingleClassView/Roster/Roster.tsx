import React, { useContext, useEffect, useState } from "react";
import styles from "./roster.module.css";
import { TeacherTableView } from "./TeacherTableView";
import { StudentTableView } from "./StudentTableView";
import { AddStudentModal } from "./AddStudentModal";
import { APIContext } from "../../../context/APIContext";
import { User } from "../../../models/User";

type RosterProps = {
  id: string;
};
export const Roster: React.FC<RosterProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [showTeacher, setShowTeacher] = useState(true);
  const [showStudent, setShowStudent] = useState(true);
  const [showAddStudentPopup, setShowAddStudentPopup] = useState(false);
  const [showDeleteStudents, setShowDeleteStudents] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState("");
  const [roster, setRoster] = useState<User[]>([]);
  const [rosterChange, setRosterChange] = useState(false);

  const onTeacherDropdownClick = (): void => {
    setShowTeacher(!showTeacher);
  };
  const onStudentDropdownClick = (): void => {
    setShowStudent(!showStudent);
  };

  const handleClose = (): void => {
    setShowAddStudentPopup(false);
  };

  const handleDelete = (id: string): void => {
    setStudentToDelete(id);
  };

  useEffect(() => {
    const deleteStudent = async (studentId: string): Promise<void> => {
      await api.deleteCommitment(id, studentId).then(() => setRosterChange(true));
    };

    if (studentToDelete != "") {
      deleteStudent(studentToDelete);
    }
    setStudentToDelete("");
  }, [studentToDelete]);

  useEffect(() => {
    const getUsers = async (): Promise<void> => {
      await api.getRoster(id).then((fetchedUsers) => {
        setRoster(fetchedUsers);
        setRosterChange(false);
      });
    };
    getUsers();
  }, [rosterChange]);

  return (
    <>
      {showAddStudentPopup && (
        <AddStudentModal
          handleClose={handleClose}
          setRosterChange={setRosterChange}
          classId={id}
          currentStudents={roster.filter((user) => user.role == "Student")}
        />
      )}
      <div className={styles.container}>
        <div>
          <div className={styles.title}>Roster</div>
          <div className={styles.editButtonContainer}>
            {showDeleteStudents ? (
              <button className={styles.editButton} onClick={() => setShowDeleteStudents(false)}>
                Done
              </button>
            ) : (
              <>
                <button className={styles.editButton}>
                  Edit
                  <img src={"/EditIcon.png"} />
                </button>
                <div className={styles.editDropdown}>
                  <button onClick={() => setShowAddStudentPopup(true)}> Add </button>
                  <button onClick={() => setShowDeleteStudents(true)}> Delete </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.spacer} />
        <div className={styles.dropdownHeader}>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => onTeacherDropdownClick()}>
              <img src={"/downArrow.png"} />
            </button>
          </div>
          <div className={styles.buttonLabel}> Teachers </div>
        </div>
        {showTeacher ? (
          <TeacherTableView teachers={roster.filter((user) => user.role == "Teacher")} />
        ) : null}
        <div className={styles.spacer} />
        <div className={styles.dropdownHeader}>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => onStudentDropdownClick()}>
              <img src={"/downArrow.png"} />
            </button>
          </div>
          <div className={styles.buttonLabel}> Students </div>
        </div>
        {showStudent ? (
          <StudentTableView
            students={roster.filter((user) => user.role == "Student")}
            isDeleteEnabled={showDeleteStudents}
            handleDelete={handleDelete}
          />
        ) : null}
      </div>
    </>
  );
};
