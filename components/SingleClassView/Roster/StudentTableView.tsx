import React from "react";
import styles from "./roster.module.css";
import { User } from "../../../models";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

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
  // const [tableRows, setTableRows] = useState<JSX.Element[]>([]);
  const router = useRouter();

  const onProfileClick = (id: string): void => {
    router.push(`/profile/${id}`);
  };

  const tableRows = students.map((user) => {
    return (
      <tr className={styles.tableRow} key={user.id}>
        {isDeleteEnabled ? (
          <td className={styles.deleteCol}>
            <button className={styles.deleteButton} onClick={() => handleDelete(user.id)}>
              <img src={"/DeleteIcon.png"} />
            </button>
          </td>
        ) : (
          <td className={styles.deleteCol}> </td>
        )}
        <td>{user.firstName}</td>
        <td>{user.lastName}</td>
        <td>{user.role}</td>
        <td>
          <Button onClick={() => onProfileClick(user.id)}>
            {" "}
            View Profile
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <table className={styles.table}>
      <tr className={styles.tableRow}>
        <td className={styles.deleteCol}> </td>
        <td>First</td>
        <td>Last</td>
        <td>Position</td>
        <td>Info</td>
      </tr>
      <tbody>{tableRows}</tbody>
    </table>
  );
};
