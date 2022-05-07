import React from 'react';
import styles from './roster.module.css';

export const Roster: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                Roster
            </div>
        </div>
    )
}