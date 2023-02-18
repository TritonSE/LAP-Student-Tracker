import { Class } from "../../../models/";
import { APIContext } from "../../../context/APIContext";
import styles from "./StudentClasses.module.css";
import React, { useContext, useEffect, useState } from "react";
import RRule from "rrule";
import { DateTime } from "luxon";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import AccessTime from "@mui/icons-material/AccessTime";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import School from "@mui/icons-material/School";

type StudentClassesProps = {
  id: string;
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const StudentClasses: React.FC<StudentClassesProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    (async () => {
      await getClasses();
    })();
  }, [id]);

  const getClasses = async (): Promise<void> => {
    if (id) {
      const classesByUser = await api.getClassesByUser(id);
      setClasses(classesByUser);
    } else {
      setClasses([]);
    }
  };

  return (
    <>
      <Accordion className={styles.accordion} allowMultipleExpanded={true} allowZeroExpanded={true}>
        Classes
        <div className={styles.spacer} />
        {classes.map((Class) => (
          <AccordionItem className={styles.item} key={Class.eventInformationId + id}>
            <AccordionItemHeading>
              <AccordionItemButton className={styles.button}>
                {Class.name}{" "}
                {Class.minLevel == Class.maxLevel
                  ? Class.minLevel
                  : Class.minLevel + "-" + Class.maxLevel}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className={styles.panel}>
              <AccessTime />{" "}
              <div className={styles.info}>
                {DateTime.fromFormat(Class.startTime, "HH:mm:ss.SSSZZ").toFormat("t") +
                  " - " +
                  DateTime.fromFormat(Class.endTime, "HH:mm:ss.SSSZZ").toFormat("t")}
              </div>
              <br />
              <CalendarMonth />{" "}
              <div className={styles.info}>
                {
                  // Capitalize the first letter of the occurrence + start the occurrence string
                  // at the second char + month number to month name + day of month + full year
                  RRule.fromString(Class.rrstring).toText().charAt(0).toUpperCase() +
                    RRule.fromString(Class.rrstring).toText().slice(1) +
                    ", start " +
                    monthNames[RRule.fromString(Class.rrstring).options.dtstart.getMonth()] +
                    " " +
                    RRule.fromString(Class.rrstring).options.dtstart.getDate() +
                    ", " +
                    RRule.fromString(Class.rrstring).options.dtstart.getFullYear()
                }
              </div>
              <br />
              <School />{" "}
              <div className={styles.info}>
                <a href={"/class/" + Class.eventInformationId}>Class Link</a>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export { StudentClasses };
