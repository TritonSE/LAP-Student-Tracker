import React, { useContext, useState } from "react";
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
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

const FadeMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  // eslint-disable-next-line
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // eslint-disable-next-line
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img src="/VerticalMenu.svg" className={styles.verticalMenu} />
      </Button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>Rename</MenuItem>
        <MenuItem onClick={handleClose}>Add Item</MenuItem>
        <MenuItem onClick={handleClose}>Delete Item</MenuItem>
        <MenuItem onClick={handleClose}>Move Up</MenuItem>
        <MenuItem onClick={handleClose}>Move Down</MenuItem>
      </Menu>
    </>
  );
};

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

type EditLessonProps = {
  moduleId: string;
  itemId: string;
  in_title: string;
  in_link: string;
};

// eslint-disable-next-line
const AccordionLesson = ({ lesson }: { lesson: APIModuleItem }) => {
  const [edit, setEdit] = useState(false);
  const api = useContext(APIContext);
  const [title, setTitle] = useState(lesson.title);
  const [link, setLink] = useState(lesson.link.toString());

  // handles create wizard submit
  const handleSubmit = async (): Promise<void> => {
    try {
      // Create class event and calendar information
      const item = {
        title: title,
        link: link,
        moduleId: lesson.moduleId,
        itemId: lesson.itemId,
      };
      await api.updateItem(lesson.moduleId, lesson.itemId, item);
    } catch (e) {}
  };

  const handleCancel = async (): Promise<void> => {
    setTitle(lesson.title);
    setLink(lesson.link.toString());
    setEdit(false);
  };

  // eslint-disable-next-line
  const pencilClick = () => {
    setEdit(!edit);
  };

  return (
    <AccordionDetails className={styles.dropdownItem}>
      {lesson.title}
      <img src="/Pencil.svg" className={styles.editPencil} onClick={pencilClick} />
      {edit ? (
        <div>
          <div>Edit Lesson</div>
          <input
            className={`${styles.label} ${styles.classInput}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Lesson Title"
          />
          <input
            className={`${styles.label} ${styles.classInput}`}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            type="text"
            placeholder="Lesson Link"
          />
          <button onClick={handleCancel} className={styles.confirmButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.confirmButton}>
            Save
          </button>
        </div>
      ) : null}
    </AccordionDetails>
  );
};

// eslint-disable-next-line
const AccordionModule: any = ({ module }: { module: Module }) => {
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
        <FadeMenu />
      </AccordionSummary>
      {lessons.map((lesson, idx) => (
        <AccordionLesson lesson={lesson} key={`${lesson.title}-${idx}`} />
      ))}
    </Accordion>
  );
};

export const ClassModule: React.FC<ModuleProps> = ({ id }) => {
  const api = useContext(APIContext);

  const { data: modules, error } = useSWR(`api/class/${id}/modules`, () => api.getClassModules(id));

  if (error) return <CustomError />;
  if (!modules) return <CustomLoader />;

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Modules <Button className={styles.button}>Add module</Button>
      </div>
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
