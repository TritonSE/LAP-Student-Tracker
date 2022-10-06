import React, { useContext, useState } from "react";
import styles from "./roster.module.css";
import { TeacherTableView } from "./TeacherTableView";
import { APIContext } from "../../../context/APIContext";
import useSWR from "swr";
import { CustomError } from "../../util/CustomError";
import { CustomLoader } from "../../util/CustomLoader";

type RosterProps = {
  id: string;
};
export const Roster: React.FC<RosterProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [showTeacher, setShowTeacher] = useState(true);

  const { data: roster, error } = useSWR(`api/class/${id}/roster`, () => api.getRoster(id));
  if (error) return <CustomError />;
  if (!roster) return <CustomLoader />;

  const onDropdownClick = (): void => {
    setShowTeacher(!showTeacher);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>Roster</div>
      <div className={styles.spacer} />
      <div className={styles.dropdownHeader}>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={() => onDropdownClick()}>
            <img src={"/downArrow.png"} />
          </button>
        </div>
        <div className={styles.buttonLabel}> Teachers </div>
      </div>
      {showTeacher ? (
        <TeacherTableView teachers={roster.filter((user) => user.role == "Teacher")} />
      ) : null}
    </div>
  );
};
