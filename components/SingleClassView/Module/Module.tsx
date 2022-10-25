import React, { useContext, useEffect, useState } from "react";
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
import { positions } from "@mui/system";

type FadeMenuProps = {
  module: Module;
  numModules: number;
};

const FadeMenu: React.FC<FadeMenuProps> = ({ module, numModules }) => {
  const api = useContext(APIContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState(module.name);
  const [position, setPosition] = useState(module.position);
  // eslint-disable-next-line
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // eslint-disable-next-line
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const in_module = {
        moduleId: module.moduleId,
        classId: module.classId,
        name: name,
        position: position,
      };
      await api.updateModule(module.moduleId, in_module);
    } catch (e) {}
  };

  const handleCancel = async (): Promise<void> => {
    setName(module.name);
    setUpdate(false);
  };

  const handleRename = () => {
    setUpdate(!update);
    handleClose();
  };

  const handleMoveUp = () => {
    if (position < numModules) {
      setPosition(position + 1);
    }
    handleSubmit();
    handleClose();
    setUpdate(!update);
  };
  const handleMoveDown = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
    handleSubmit();
    handleClose();
    setUpdate(!update);
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
        <MenuItem onClick={handleRename}>Rename</MenuItem>
        <MenuItem onClick={handleMoveUp}>Move Up</MenuItem>
        <MenuItem onClick={handleMoveDown}>Move Down</MenuItem>
      </Menu>
      {update ? (
        <div>
          <div>Update Module</div>
          <input
            className={`${styles.label} ${styles.classInput}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Module Name"
          />
          <button onClick={handleCancel} className={styles.confirmButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.confirmButton}>
            Save
          </button>
        </div>
      ) : null}
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

// eslint-disable-next-line
const AccordionLesson = ({ lesson }: { lesson: APIModuleItem }) => {
  const [edit, setEdit] = useState(false);
  const api = useContext(APIContext);
  const [title, setTitle] = useState(lesson.title);
  const [link, setLink] = useState(lesson.link.toString());

  const handleSubmit = async (): Promise<void> => {
    try {
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
type AccordionModuleProps = {
  module: Module;
  numModules: number;
};

const AccordionModule: React.FC<AccordionModuleProps> = ({ module, numModules }) => {
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
        <FadeMenu module={module} numModules={numModules} />
      </AccordionSummary>
      {lessons.map((lesson, idx) => (
        <AccordionLesson lesson={lesson} key={`${lesson.title}-${idx}`} />
      ))}
    </Accordion>
  );
};

export const ClassModule: React.FC<ModuleProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");

  const { data: modules, error } = useSWR(`api/class/${id}/modules`, () => api.getClassModules(id));

  if (error) return <CustomError />;
  if (!modules) return <CustomLoader />;

  const handleClick = () => {
    setPopup(!popup);
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      // Create class event and calendar information
      const module = {
        classId: id,
        name: name,
        position: 0,
        moduleId: "",
      };
      await api.createModule(module);
    } catch (e) {}
  };

  const handleCancel = async (): Promise<void> => {
    setPopup(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Modules{" "}
        <Button className={styles.button} onClick={handleClick}>
          Add module
        </Button>
      </div>
      {popup ? (
        <div>
          <div>Create Module</div>
          <input
            className={`${styles.label} ${styles.classInput}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Module Name"
          />
          <button onClick={handleCancel} className={styles.confirmButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} className={styles.confirmButton}>
            Save
          </button>
        </div>
      ) : null}
      <div className={styles.spacer} />
      {modules.length === 0 ? (
        <div className={styles.title}>No modules found</div>
      ) : (
        modules.map((module, i) => {
          return (
            <AccordionModule
              key={`${module.name}-${i}`}
              module={module}
              numModules={modules.length}
            />
          );
        })
      )}
    </div>
  );
};
