import React from "react";
import styles from "./roster.module.css";
import {User} from "../../../models";

export const TeacherTableView: React.FC = () => {

    const tempTeachers: User[] = [
        {
            id: "tempId",
            firstName: "Teacher1",
            lastName: "lastName",
            role: "Teacher",
            pictureId: "pictureId",
            approved: true,
            email: "email.com",
            dateCreated: "none",
            phoneNumber: null, address: null
        }
    ];

    const tableRows = tempTeachers.map( (user) => {
        return(
            <tr className={styles.tableRow}>
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
    </table>)
}