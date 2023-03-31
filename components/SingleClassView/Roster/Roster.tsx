import React, { useContext, useEffect, useState } from "react";
import styles from "./roster.module.css";
import { StaffTableView } from "./StaffTableView";
import { StudentTableView } from "./StudentTableView";
import { AddPeopleModal } from "./AddPeopleModal";
import { APIContext } from "../../../context/APIContext";
import { User } from "../../../models";
import {RemovePeopleModal} from "./RemovePeopleModal";

type RosterProps = {
  id: string;
};
export const Roster: React.FC<RosterProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [showTeacher, setShowTeacher] = useState(true);
  const [showStudent, setShowStudent] = useState(true);
  const [showAddStudentPopup, setShowAddStudentPopup] = useState(false);
  const [showRemoveUsersPopup, setShowRemoveUsersPopup] = useState(false)
  const [showDeleteStudents, setShowDeleteStudents] = useState(false);
  const [roster, setRoster] = useState<User[]>([]);

  const onTeacherDropdownClick = (): void => {
    setShowTeacher(!showTeacher);
  };
  const onStudentDropdownClick = (): void => {
    setShowStudent(!showStudent);
  };

  const handleCloseAddUserPopup = (): void => {
    setShowAddStudentPopup(false);
  };

  const handleCloseRemoveUserPopup = (): void => {
    setShowRemoveUsersPopup(false);
  };

  const getRoster = async (): Promise<void> => {
    const roster = await api.getRoster(id);
    setRoster(roster);
    return;
  };


  useEffect(() => {
    (async () => {
      await getRoster();
    })();
  }, []);

  return (
    <>
      {showAddStudentPopup && (
        <AddPeopleModal
          showModal={showAddStudentPopup}
          handleClose={handleCloseAddUserPopup}
          refreshRoster={getRoster}
          classId={id}
          currentUsersInClass={roster}
        />
      )}
      { showRemoveUsersPopup && (
          <RemovePeopleModal classId={id} refreshRoster={getRoster} currentUsersInClass={roster} showModal={showRemoveUsersPopup} handleClose={handleCloseRemoveUserPopup} ></RemovePeopleModal>
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
                  <button onClick={() => setShowRemoveUsersPopup(true)}> Delete </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className={styles.spacer} />
        <div className={styles.dropdownHeader}>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => onTeacherDropdownClick()}>
              {showTeacher ? (
                <img className={styles.rotate} src={"/downArrow.png"} />
              ) : (
                <img src={"/downArrow.png"} />
              )}
            </button>
          </div>
          <div className={styles.buttonLabel}> Staff </div>
        </div>
        {showTeacher ? (
          <StaffTableView teachers={roster.filter((user) => {
            return user.role == "Teacher" || user.role == "Admin" || user.role == "Volunteer";
          })} />
        ) : null}
        <div className={styles.spacer} />
        <div className={styles.dropdownHeader}>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={() => onStudentDropdownClick()}>
              {showStudent ? (
                <img className={styles.rotate} src={"/downArrow.png"} />
              ) : (
                <img src={"/downArrow.png"} />
              )}
            </button>
          </div>
          <div className={styles.buttonLabel}> Students </div>
        </div>
        {showStudent ? (
          <StudentTableView
            students={roster.filter((user) => user.role == "Student")}
          />
        ) : null}
      </div>
    </>
  );
};
