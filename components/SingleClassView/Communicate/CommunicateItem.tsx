import styles from "./communicate.module.css";
import React, { useState, useContext } from "react";
import { APIContext } from "../../../context/APIContext";
import { AuthContext } from "../../../context/AuthContext";
import { Announcement } from "../../../models";
import { CustomError } from "../../../components/util/CustomError";

type CommunicateItemProps = {
  id: string;
  announcement: Announcement;
  idx: number;
  triggerClassModuleRefresh: () => void;
};

export const CommunicateItem: React.FC<CommunicateItemProps> = ({
  id,
  announcement,
  idx,
  triggerClassModuleRefresh,
}) => {
  const api = useContext(APIContext);
  const { user } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);

  const handleClick: VoidFunction = () => {
    setShowContent(!showContent);
  };

  const handleCancel: VoidFunction = () => {
    setDeleteItem(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    await api.deleteAnnouncement(id, announcement.announcementId);
    triggerClassModuleRefresh();
  };

  if (user == null) return <CustomError />;

  return (
    <>
      <div className={styles.dropdownItem} key={`${announcement.title}-${idx}`}>
        <div className={styles.dropdownItemText} onClick={handleClick}>
          {" "}
          {announcement.title}{" "}
        </div>
        {(user.role == "Teacher" || user.role == "Admin") && (
          <img src="/Trash.svg" className={styles.trash} onClick={() => setDeleteItem(true)} />
        )}
      </div>
      {showContent && (
        <div className={styles.dropdownDropdownItem} key={`${announcement.title}-${idx}`}>
          {announcement.content.trimEnd()}
        </div>
      )}

      {deleteItem ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>
              Do you want to delete the following lesson: {announcement.title}?
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
    </>
  );
};
