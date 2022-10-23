import React, { useContext } from "react";
import styles from "./modules.module.css";
import { APIContext } from "../../../context/APIContext";
import useSWR from "swr";
import { CustomError } from "../../util/CustomError";
import { CustomLoader } from "../../util/CustomLoader";
import { Module } from "../../../models";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Pencil from "/assets/icons/Pencil.svg";

type ModuleProps = {
  id: string;
  enableEditing: boolean;
};

interface APIModuleItem {
  itemId: string;
  link: URL;
  moduleId: string;
  title: string;
}

const AccordionLesson = ({ lesson }: { lesson: APIModuleItem }, enableEditing: boolean) => (
  <AccordionDetails className={styles.dropdownItem}>
    {lesson.title}
    {enableEditing ? Pencil : null}
  </AccordionDetails>
);

const AccordionModule = ({ module }: { module: Module }, enableEditing: boolean) => {
  const api = useContext(APIContext);

  const { data: lessons, error } = useSWR<APIModuleItem[]>(`${module.moduleId}`, () =>
    api.getModuleItems(module.moduleId)
  );

  if (error) return <CustomError />;
  if (!lessons) return <CustomLoader />;

  return (
    <Accordion>
      <AccordionSummary className={styles.dropdownHeader} expandIcon={<ExpandMoreIcon />}>
        {module.name}
      </AccordionSummary>
      {lessons.map((lesson, idx) => (
        <AccordionLesson lesson={lesson} key={`${lesson.title}-${idx}`} />
      ))}
    </Accordion>
  );
};

export const ClassModule: React.FC<ModuleProps> = ({ id, enableEditing }) => {
  const api = useContext(APIContext);

  const { data: modules, error } = useSWR(`api/class/${id}/modules`, () => api.getClassModules(id));

  if (error) return <CustomError />;
  if (!modules) return <CustomLoader />;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Module</div>
      <div className={styles.spacer} />
      {modules.length === 0 ? (
        <div className={styles.title}>No modules found</div>
      ) : (
        modules.map((module, i) => {
          return <AccordionModule key={`${module.name}-${i}`} module={module} />;
        })
      )}
    </div>
  );
};
