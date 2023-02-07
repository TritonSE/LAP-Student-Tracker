import { Item, Module } from "../../../models";
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import styles from "./modules.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import { AccordionItem } from "./AccordionItem";

type AccordionModuleProps = {
  module: Module;
  numModules: number;
  deleteModuleWithinState: (id: string) => void;
  triggerClassModuleRefresh: () => void;
  setSave: Dispatch<SetStateAction<boolean>>;
  modules: Module[];
  setModules: Dispatch<SetStateAction<Module[]>>;
};
export const AccordionModule: React.FC<AccordionModuleProps> = ({
  module,
  numModules,
  deleteModuleWithinState,
  triggerClassModuleRefresh,
  setSave,
  modules,
  setModules,
}) => {
  const position = module.position;
  const api = useContext(APIContext);
  const [lessons, setLessons] = useState<Item[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [updatePopUp, setUpdatePopUp] = useState(false);
  const [name, setName] = useState(module.name);
  const [addModal, setAddModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [itemLink, setItemLink] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api.getModuleItems(module.moduleId);
      setLessons(res);
    })();
  }, [refresh, modules]);

  if (!lessons) return <CustomLoader />;

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  // closes 3 dots menu
  const handleClose = (): void => {
    setAnchorEl(null);
  };

  // shows update pop up
  const handleRename: VoidFunction = () => {
    setUpdatePopUp(true);
    handleClose();
  };

  // shows add item pop up
  const handleAdd: VoidFunction = () => {
    setAddModal(true);
    handleClose();
  };

  const handleCancel = async (): Promise<void> => {
    setName(module.name);
    setUpdatePopUp(false);
    setAddModal(false);
  };

  // shows delete pop up
  const handleDelete = async (): Promise<void> => {
    setDeleteItemModal(true);
    handleClose();
  };

  // helper function to trigger refresh within this compoenent
  const triggerItemDataWithinModuleRefresh = (): void => {
    setRefresh(!refresh);
  };

  // submits modal
  const handleSubmit = async (): Promise<void> => {
    const inModule = {
      moduleId: module.moduleId,
      classId: module.classId,
      name: name,
      position: position,
    };
    await api.updateModule(module.moduleId, inModule);
    // refresh parent element to get updated data
    triggerClassModuleRefresh();
    setUpdatePopUp(false);
  };

  const handleDeleteSubmit: VoidFunction = async () => {
    await api.deleteModule(module.moduleId);
    deleteModuleWithinState(module.moduleId);
    setDeleteItemModal(false);
  };

  const handleAddSubmit: VoidFunction = async () => {
    const lesson = {
      title: itemName,
      link: itemLink,
      moduleId: module.moduleId,
      itemId: "",
    };
    await api.createItem(module.moduleId, lesson);
    triggerItemDataWithinModuleRefresh();
    setAddModal(false);
    setItemName("");
    setItemLink("");
  };

  const handleMoveUp: VoidFunction = () => {
    // account for position not being zero indexed
    const currentModuleIndex = position - 1;

    if (currentModuleIndex > 0) {
      setSave(true);

      // move module up
      setModules((previousModules) => {
        const newModules = [...previousModules];

        // swap module with item above it
        const currentModule = previousModules[currentModuleIndex];
        const aboveModule = previousModules[currentModuleIndex - 1];
        const newPosition = aboveModule.position;
        newModules[currentModuleIndex - 1].position = currentModule.position;
        newModules[currentModuleIndex].position = newPosition;

        // resort array in order
        newModules.sort((a, b) => a.position - b.position);

        return newModules;
      });
    }
    handleClose();
  };

  const handleMoveDown: VoidFunction = () => {
    // account for position not being zero indexed
    const currentModuleIndex = position - 1;

    if (currentModuleIndex < numModules - 1) {
      setSave(true);

      // move module down
      setModules((previousModules) => {
        const newModules = [...previousModules];

        // swap module with item below it
        const currentModule = previousModules[currentModuleIndex];
        const belowModule = previousModules[currentModuleIndex + 1];
        const newPosition = belowModule.position;
        newModules[currentModuleIndex + 1].position = currentModule.position;
        newModules[currentModuleIndex].position = newPosition;

        // resort array in order
        newModules.sort((a, b) => a.position - b.position);

        return newModules;
      });
    }
    handleClose();
  };

  return (
    <div>
      <div className={styles.accordionHeader}>
        <div>
          <div className={styles.dropdownHeader}>
            {module.name}
            <div className={styles.verticalMenu}>
              <Button
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                {/* Edit Module */}
                <img src="/VerticalMenu.svg" />
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
            </div>
          </div>
        </div>
        <div>
          {lessons.map((lesson, idx) => (
            <AccordionItem
              triggerItemDataWithinModuleRefresh={triggerItemDataWithinModuleRefresh}
              lesson={lesson}
              key={`${lesson.title}-${idx}`}
            />
          ))}
        </div>
      </div>
      {updatePopUp ? (
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
      {addModal ? (
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
      {deleteItemModal ? (
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
