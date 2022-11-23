import React, { useEffect, useState } from "react";
import styles from "./roster.module.css";
import { User } from "../../../models";
import { useRouter } from "next/router";

type StudentTableViewProps = {
  students: User[];
  isDeleteEnabled: boolean;
  handleDelete: (id: string) => void;
};

export const StudentTableView: React.FC<StudentTableViewProps> = ({
  students,
  isDeleteEnabled,
  handleDelete,
}) => {
  const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
  const router = useRouter();

  const onProfileClick = (id: string): void => {
    router.push(`/profile/${id}`);
  };

  useEffect(() => {
    const rows = students.map((user) => {
      return (
        <tr className={styles.tableRow} key={user.id}>
          {isDeleteEnabled && (
            <td>
              <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>
                <img src={"/DeleteIcon.png"} />
              </button>
            </td>
          )}
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
    setTableRows(rows);
  }, [students]);

  return (
    <table className={styles.table}>
      <tbody>
        <tr className={styles.tableHeader}>
          {isDeleteEnabled && <th></th>}
          <th>First</th>
          <th>Last</th>
          <th>Position</th>
          <th>Info</th>
        </tr>
        {tableRows}
      </tbody>
    </table>
  );
};
