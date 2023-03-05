import { Item } from "../../../models";
import React, { useContext, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import styles from "./modules.module.css";
import {ModalActions, ModalHeader} from "../../util/ModalComponents";
import {Dialog, DialogContent, TextField} from "@mui/material";

type AccordionItemProps = {
  lesson: Item;
  triggerItemDataWithinModuleRefresh: () => void;
};
const AccordionItem: React.FC<AccordionItemProps> = ({
  lesson,
  triggerItemDataWithinModuleRefresh,
}) => {
  const [edit, setEdit] = useState(false);
  const api = useContext(APIContext);
  const [title, setTitle] = useState(lesson.title);
  const [link, setLink] = useState(lesson.link.toString());
  const [deleteItem, setDeleteItem] = useState(false);

  const [newTitle, setNewTitle] = useState(lesson.title);
  const [newLink, setNewLink] = useState(lesson.link);

  // submit creating a new item
  const handleSubmit = async (): Promise<void> => {
    const item = {
      title: newTitle,
      link: newLink,
      moduleId: lesson.moduleId,
      itemId: lesson.itemId,
    };
    await api.updateItem(lesson.moduleId, lesson.itemId, item);
    triggerItemDataWithinModuleRefresh();
    setEdit(false);
  };

  const handleCancel = async (): Promise<void> => {
    setTitle(lesson.title);
    setLink(lesson.link.toString());
    setEdit(false);
  };

  // function to delete an item
  const handleDeleteConfirm = async (): Promise<void> => {
    await api.deleteItem(lesson.moduleId, lesson.itemId);
    triggerItemDataWithinModuleRefresh();
  };

  // show edit pop up modal
  const pencilClick = (): void => {
    setEdit(true);
  };

  return (
    <div>
      <div className={styles.dropdownItem}>
        <a href={link}>{title}</a>
        <img src="/Pencil.svg" className={styles.editPencil} onClick={pencilClick} />
        <img src="/Trash.svg" className={styles.trash} onClick={() => setDeleteItem(true)} />
      </div>

      {edit ? (

          <Dialog PaperProps={{
            style: {borderRadius: 10, width: 450}
          }} open={edit} onClose={handleCancel}>
            <ModalHeader title={"Update Lesson"}/>

            <DialogContent>
              <TextField
                  autoFocus
                  margin = "dense"
                  id="addModal"
                  label="Lesson Title"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setNewTitle(e.target.value)}
              />
              <TextField
                  margin = "dense"
                  id="itemLink"
                  label="Lesson Link"
                  fullWidth
                  variant="standard"
                  onChange={(e) => setNewLink(e.target.value)}/>
            </DialogContent>

            <ModalActions handleSubmit={handleSubmit} handleCancel={handleCancel}/>
          </Dialog>
      ) : null}
      {deleteItem ? (
          <Dialog PaperProps={{
            style: {borderRadius: 10, width: 450}
          }} open={deleteItem} onClose={handleCancel}>

            <ModalHeader title={"Delete Module"} description={`Do you want to delete the following lesson: ${lesson.title}?`}/>
            <ModalActions handleSubmit={handleDeleteConfirm} handleCancel={handleCancel}/>
          </Dialog>
      ) : null}
    </div>
  );
};

export { AccordionItem };
