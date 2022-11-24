import React, { useContext, useEffect, useState } from "react";
import styles from "./modules.module.css";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { Item, Module } from "../../../models";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";

type ModuleProps = {
  id: string;
  enableEditing: boolean;
};

// eslint-disable-next-line
const AccordionItem = ({ lesson }: { lesson: Item }) => {
  const [edit, setEdit] = useState(false);
  const api = useContext(APIContext);
  const [title, setTitle] = useState(lesson.title);
  const [link, setLink] = useState(lesson.link.toString());
  const [deleteItem, setDeleteItem] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const item = {
      title: title,
      link: link,
      moduleId: lesson.moduleId,
      itemId: lesson.itemId,
    };
    await api.updateItem(lesson.moduleId, lesson.itemId, item);
    setEdit(false);
  };

  const handleCancel = async (): Promise<void> => {
    setTitle(lesson.title);
    setLink(lesson.link.toString());
    setEdit(false);
  };

  const handleYes = async (): Promise<void> => {
    await api.deleteItem(lesson.moduleId, lesson.itemId);
    setDeleteItem(false);
  };

  // eslint-disable-next-line
  const pencilClick = () => {
    setEdit(!edit);
  };

  return (
    <AccordionDetails className={styles.dropdownItem}>
      {lesson.title}
      <img src="/Pencil.svg" className={styles.editPencil} onClick={pencilClick} />
      <img src="/Trash.svg" className={styles.trash} onClick={() => setDeleteItem(true)} />
      {edit ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Edit Lesson</div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Lesson Title"
            />
            <br />
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              type="text"
              placeholder="Lesson Link"
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.submit}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {deleteItem ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>
              Do you want to delete the following lesson: {lesson.title}?
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleYes} className={styles.submit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AccordionDetails>
  );
};

type AccordionModuleProps = {
  module: Module;
  numModules: number;
};

const AccordionModule: React.FC<AccordionModuleProps> = ({ module, numModules }) => {
  const api = useContext(APIContext);
  const [lessons, setLessons] = useState<Item[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [update, setUpdate] = useState(false);
  const [name, setName] = useState(module.name);
  const [position, setPosition] = useState(module.position);
  const [add, setAdd] = useState(false);
  const [itemName, setItemName] = useState("");
  const [deleteItem, setDeleteItem] = useState(false);
  const [itemLink, setItemLink] = useState("");

  useEffect(() => {
    (async () => {
      const res = await api.getModuleItems(module.moduleId);
      setLessons(res);
    })();
  }, []);

  if (!lessons) return <CustomLoader />;

  // eslint-disable-next-line
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // eslint-disable-next-line
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRename: VoidFunction = () => {
    setUpdate(!update);
    handleClose();
  };

  const handleAdd: VoidFunction = () => {
    setAdd(!add);
    handleClose();
  };

  const handleDelete: VoidFunction = async () => {
    setDeleteItem(true);
    handleClose();
  };

  const handleSubmit = async (): Promise<void> => {
    const inModule = {
      moduleId: module.moduleId,
      classId: module.classId,
      name: name,
      position: position,
    };
    await api.updateModule(module.moduleId, inModule);
    setUpdate(!update);
  };

  const handleCancel = async (): Promise<void> => {
    setName(module.name);
    setUpdate(false);
    setAdd(false);
  };

  const handleDeleteSubmit: VoidFunction = async () => {
    await api.deleteModule(module.moduleId);
    await setDeleteItem(false);
  };

  const handleAddSubmit: VoidFunction = async () => {
    const lesson = {
      title: itemName,
      link: itemLink,
      moduleId: module.moduleId,
      itemId: "",
    };
    await api.createItem(module.moduleId, lesson);
    setAdd(!add);
    setLessons([...lessons, lesson]);
  };

  const handleMoveUp: VoidFunction = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
    handleClose();
  };

  const handleMoveDown: VoidFunction = () => {
    if (position < numModules) {
      setPosition(position + 1);
    }
    handleClose();
  };

  return (
    <div className={styles.accordionHeader}>
      <Accordion>
        <AccordionSummary className={styles.dropdownHeader} expandIcon={<ExpandMoreIcon />}>
          {module.name}
        </AccordionSummary>
        <>
          <Button
            id="fade-button"
            aria-controls={open ? "fade-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Edit Module
            {/* <img src="/VerticalMenu.svg" className={styles.verticalMenu} /> */}
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
            <MenuItem onClick={handleRename}>Rename Module</MenuItem>
            <MenuItem onClick={handleDelete}>Delete Module</MenuItem>
            <MenuItem onClick={handleAdd}>Add Item</MenuItem>
            <MenuItem onClick={handleMoveUp}>Move Up</MenuItem>
            <MenuItem onClick={handleMoveDown}>Move Down</MenuItem>
          </Menu>
        </>
        <AccordionDetails>
          {lessons.map((lesson, idx) => (
            <AccordionItem lesson={lesson} key={`${lesson.title}-${idx}`} />
          ))}
        </AccordionDetails>
      </Accordion>
      {update ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Update Module</div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Module Name"
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.submit}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {add ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Add Lesson</div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              type="text"
              placeholder="Lesson Title"
            />
            <br />
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={itemLink}
              onChange={(e) => setItemLink(e.target.value)}
              type="text"
              placeholder="Lesson Link"
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleAddSubmit} className={styles.submit}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {deleteItem ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Delete Module?</div>
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleDeleteSubmit} className={styles.submit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const ClassModule: React.FC<ModuleProps> = ({ id }) => {
  const api = useContext(APIContext);
  const [modules, setModules] = useState<Module[]>([]);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const res = await api.getClassModules(id);
      setModules(res);
    })();
  }, []);

  if (!modules) return <CustomLoader />;

  const handleClick: VoidFunction = () => {
    setPopup(!popup);
  };

  const handleSubmit = async (): Promise<void> => {
    const module = {
      classId: id,
      name: name,
      position: 0,
      moduleId: "",
    };
    await api.createModule(module);
    setPopup(false);
    setModules([...modules, module]);
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
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Create Module</div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Module Name"
            />
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.submit}>
                Save
              </button>
            </div>
          </div>
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
