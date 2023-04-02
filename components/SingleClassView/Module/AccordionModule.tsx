import { Item, Module } from "../../../models";
import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { Dialog, DialogContent, TextField } from "@mui/material";
import styles from "./modules.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import { AccordionItem } from "./AccordionItem";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";

type AccordionModuleProps = {
  module: Module;
  numModules: number;
  deleteModuleWithinState: (id: string) => void;
  triggerClassModuleRefresh: () => void;
};
export const AccordionModule: React.FC<AccordionModuleProps> = ({
  module,
  numModules,
  deleteModuleWithinState,
  triggerClassModuleRefresh,
}) => {
  const api = useContext(APIContext);
  const [lessons, setLessons] = useState<Item[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [updatePopUp, setUpdatePopUp] = useState(false);
  const [name, setName] = useState(module.name);
  const [position, setPosition] = useState(module.position);
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
  }, [refresh]);

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

  const handleCancel = (): void => {
    setName(module.name);
    setUpdatePopUp(false);
    setAddModal(false);
    setDeleteItemModal(false);
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

  const handleDeleteSubmit = async (): Promise<void> => {
    await api.deleteModule(module.moduleId);
    deleteModuleWithinState(module.moduleId);
    setDeleteItemModal(false);
  };

  const handleAddSubmit = async (): Promise<void> => {
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

  // TODO: work on implementing this
  const handleMoveUp: VoidFunction = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
    handleClose();
  };

  // TODO: work on implementing this
  const handleMoveDown: VoidFunction = () => {
    if (position < numModules) {
      setPosition(position + 1);
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
        <Dialog
          PaperProps={{
            style: { borderRadius: 10, width: 450 },
          }}
          open={updatePopUp}
          onClose={handleCancel}
        >
          <ModalHeader title={"Update Module"} />
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="ModuleName"
              label="Module Name"
              fullWidth
              variant="standard"
              onChange={(e) => setName(e.target.value)}
            />
          </DialogContent>

          <ModalActions handleSubmit={handleSubmit} handleCancel={handleCancel} />
        </Dialog>
      ) : null}
      {addModal ? (
        <Dialog
          PaperProps={{
            style: { borderRadius: 10, width: 450 },
          }}
          open={addModal}
        >
          <ModalHeader title={"Add Item"} />
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="addModal"
              label="Lesson Title"
              fullWidth
              variant="standard"
              onChange={(e) => setItemName(e.target.value)}
            ></TextField>
            <TextField
              margin="dense"
              id="itemLink"
              label="Lesson Link"
              fullWidth
              variant="standard"
              onChange={(e) => setItemLink(e.target.value)}
            ></TextField>
          </DialogContent>
          <ModalActions handleSubmit={handleAddSubmit} handleCancel={handleCancel} />
        </Dialog>
      ) : null}
      {deleteItemModal ? (
        <Dialog
          PaperProps={{
            style: { borderRadius: 10, width: 450 },
          }}
          open={deleteItemModal}
          onClose={handleCancel}
        >
          <ModalHeader
            title={"Delete Module"}
            description={"Are you sure you would like to delete this module?"}
          />

          <ModalActions handleSubmit={handleDeleteSubmit} handleCancel={handleCancel} />
        </Dialog>
      ) : null}
    </div>
  );
};
