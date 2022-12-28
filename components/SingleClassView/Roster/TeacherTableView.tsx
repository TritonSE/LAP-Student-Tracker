import React from "react";
import styles from "./roster.module.css";
import { User } from "../../../models";
import { useRouter } from "next/router";

type TeacherTableViewProps = {
  teachers: User[];
};

export const TeacherTableView: React.FC<TeacherTableViewProps> = ({ teachers }) => {
  const router = useRouter();

  const onProfileClick = (id: string): void => {
    router.push(`/profile/${id}`);
  };

  const tableRows = teachers.map((user) => {
    return (
      <tr className={styles.tableRow} key={user.id}>
        <td className={styles.deleteCol}> </td>
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.role}</td>
        <td>
          <button className={styles.profileButton} onClick={() => onProfileClick(user.id)}>
            {" "}
            View Profile
          </button>
        </td>
      </tr>
    );
  });

  return (
    <table className={styles.table}>
      <tr className={styles.tableRow}>
        <td> </td>
        <td>First</td>
        <td>Last</td>
        <td>Position</td>
        <td>Info</td>
      </tr>
      <tbody>{tableRows}</tbody>
    </table>
  );
};
