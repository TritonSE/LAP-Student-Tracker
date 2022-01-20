import React, { useState, useEffect } from 'react';
import { Class } from '../models/classes';
import styles from '../styles/Components.module.css';

type ClassCardProps = { class: Class };

const ClassCard: React.FC<ClassCardProps> = ({ class: classObj }) => {

  return (
    <>
      <div className={styles.listElem}>
        <p>{classObj.name}</p>
        <p>{classObj.recurrence}</p>
        <p>{classObj.timeStart}</p>
        <p>{classObj.timeEnd}</p>
      </div>
    </>

  )
}

export default ClassCard;