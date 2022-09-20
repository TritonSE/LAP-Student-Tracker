import React from "react";
import styles from "./roster.module.css";
import {User} from "../../../models";

type TeacherTableViewProps = {
    teachers: User[]
};

export const TeacherTableView: React.FC<TeacherTableViewProps> = ({teachers}) => {

    const tableRows = teachers.map( (user) => {
        return(
            <tr className={styles.tableRow} key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.role}</td>
                <td>
                    <button className={styles.profileButton}> View Profile</button>
                </td>
            </tr>

        );
    });


    return (
        <table className={styles.table}>
        <tr className={styles.tableHeader}>
            <th>First</th>
            <th>Last</th>
            <th>Position</th>
            <th>Info</th>
        </tr>
            {tableRows}
    </table>);
}