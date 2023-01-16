import { Item } from "../../../models";
import React, { useContext, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import styles from "./modules.module.css";

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

  // submit creating a new item
  const handleSubmit = async (): Promise<void> => {
    const item = {
      title: title,
      link: link,
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
              <button onClick={handleDeleteConfirm} className={styles.submit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export { AccordionItem };
