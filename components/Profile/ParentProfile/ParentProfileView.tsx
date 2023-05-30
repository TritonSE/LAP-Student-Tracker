import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./ParentProfileView.module.css";
import { CustomError } from "../../util/CustomError";
import { APIContext } from "../../../context/APIContext";
import { User } from "../../../models/";
import { ParentEditProfilePanel } from "./ParentEditProfilePanel";
import axios from "axios";
import { ConnectStudentProfile } from "./ConnectStudentProfile";
import { ConnectedStudentDisplay } from "./ConnectedStudentDisplay";
import { AddStudentModal } from "./AddStudentModal";
import { StudentClasses } from "./StudentClasses";

// component that renders the admin/teacher profile page
type ParentProfileViewProps = {
  otherUser?: User; // if we need to display a user that is not the logged in one, pass the details here
};
const ParentProfileView: React.FC<ParentProfileViewProps> = ({ otherUser }) => {
  const authState = useContext(AuthContext);
  const { user: loggedInUser } = authState;

  const [showConnectStudentModal, setShowConnectStudentModal] = useState(false);
  const [createParentStudentLinkError, setCreateParentStudentLinkError] = useState("");
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [showAddNewStudentBox, setShowAddNewStudentBox] = useState(true);
  const [_, setCurrentStudent] = useState<User | null>(null);

  const api = useContext(APIContext);

  // user will never be null, because if it is, client is redirected to login page
  if (loggedInUser == null) return <CustomError />;

  useEffect(() => {
    (async () => {
      await getStudentsLinkedToParent();
    })();
  }, []);

  const getStudentsLinkedToParent = async (): Promise<void> => {
    const studentsLinkedToParent = await api.getStudentsLinkedToParent(loggedInUser.id);
    setAllStudents(studentsLinkedToParent);
    // if there is already one connected user, set the first one as the main one
    if (studentsLinkedToParent.length > 0) {
      setCurrentStudent(studentsLinkedToParent[0]);
      setShowAddNewStudentBox(false);
    }
  };

  // function to handle going right in the cards of linked students
  const incrementStudent = (): void => {
    const newIndex = currentStudentIndex + 1;
    if (newIndex < allStudents.length) {
      setCurrentStudentIndex(newIndex);
      setCurrentStudent(allStudents[newIndex]);
    }

    // if incrementing past end of user list, render the add user box
    if (newIndex == allStudents.length) {
      setShowAddNewStudentBox(true);
      setCurrentStudentIndex(newIndex);
    }
  };

  // function to handle going left on the cards of linked students
  const decrementStudent = (): void => {
    const newIndex = currentStudentIndex - 1;

    if (newIndex > -1) {
      // decrementing should stop displaying the add user box
      setShowAddNewStudentBox(false);
      setCurrentStudentIndex(newIndex);
      setCurrentStudent(allStudents[newIndex]);
      setShowAddNewStudentBox(false);
    }
  };

  // array of rendered user cards (we flip between these when hitting left/right arrows)
  const renderStudentCards = allStudents.map((student) => (
    <ConnectedStudentDisplay
      key={student.id}
      incrementStudent={incrementStudent}
      decrementStudent={decrementStudent}
      student={student}
    />
  ));

  const setShowConnectStudentState = (newState: boolean): void => {
    setShowConnectStudentModal(newState);
  };

  // function used to link parent and user
  const createParentStudentLink = async (studentEmail: string): Promise<void> => {
    try {
      await api.createParentStudentLink(loggedInUser.id, { email: studentEmail });
      await getStudentsLinkedToParent();
      setShowConnectStudentState(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response)
        setCreateParentStudentLinkError(err.response.data);
      else if (err instanceof Error) setCreateParentStudentLinkError(err.message);
      else setCreateParentStudentLinkError("Error");
    }
  };

  return (
    <div>
      <div className={styles.rectangleContainer}>
        <div className={styles.rectangle}>
          <div className={styles.contentContainer}>
            <div className={styles.leftPanel}>
              <ParentEditProfilePanel
                loggedInUser={otherUser ? otherUser : loggedInUser}
                authState={authState}
                leagueAPI={api}
                customUser={otherUser == undefined}
              ></ParentEditProfilePanel>
            </div>
            <div className={styles.middlePanel}>
              {showAddNewStudentBox ? (
                <ConnectStudentProfile
                  incrementStudent={incrementStudent}
                  decrementStudent={decrementStudent}
                  setShowModalState={setShowConnectStudentState}
                />
              ) : (
                renderStudentCards[currentStudentIndex]
              )}
            </div>
            <div className={styles.rightPanel}>
              <StudentClasses
                id={allStudents[currentStudentIndex] ? allStudents[currentStudentIndex].id : ""}
              />
            </div>
          </div>
        </div>
      </div>
      {showConnectStudentModal && (
        <AddStudentModal
          showModal={showConnectStudentModal}
          linkParentAndStudent={createParentStudentLink}
          errorMsg={createParentStudentLinkError}
          setShowModalState={setShowConnectStudentState}
        />
      )}
    </div>
  );
};

export { ParentProfileView };
