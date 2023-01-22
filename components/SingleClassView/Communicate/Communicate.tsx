import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import { AuthContext } from "../../../context/AuthContext";
import Button from "@mui/material/Button";
import styles from "./communicate.module.css";
import { Announcement } from "../../../models";
import { CustomError } from "../../../components/util/CustomError";
import { CommunicateItem } from "./CommunicateItem";

type CommunicateProps = {
  id: string;
};

export const Communicate: React.FC<CommunicateProps> = ({ id }) => {
  const api = useContext(APIContext);
  const { user } = useContext(AuthContext);
  const [popup, setPopup] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api.getAnnouncements(id);
      setAnnouncements(res);
    })();
  }, [refresh]);

  const handleClick: VoidFunction = () => {
    setPopup(!popup);
  };

  const handleCancel = async (): Promise<void> => {
    setError(false);
    setPopup(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (title == "" || content == "") {
      setError(true);
    } else {
      const announcement = {
        title: title,
        content: content,
      };
      await api.createAnnouncement(id, announcement);
      triggerClassModuleRefresh();
      setError(false);
      setPopup(false);
      setTitle("");
      setContent("");
    }
  };

  const triggerClassModuleRefresh = (): void => {
    setRefresh(!refresh);
  };

  if (user == null) return <CustomError />;

  return (
    <div className={styles.container}>
      {popup ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>New Post</div>
            <input
              className={`${styles.label} ${styles.titleInput}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Summary"
            />
            <textarea
              className={`${styles.label} ${styles.contentInput}`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Message here"
            />
            {error && (
              <div className={styles.popupError}> Please give the post a title and a message. </div>
            )}
            <div className={styles.buttonContainer}>
              <button onClick={handleCancel} className={styles.cancel}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.submit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={styles.title}>Communicate</div>
      <div className={styles.line} />
      {(user.role == "Teacher" || user.role == "Admin") && (
        <>
          <div className={styles.spacer} />
          <Button className={styles.button} onClick={handleClick}>
            + New Post
          </Button>
        </>
      )}
      <div className={styles.spacer} />
      <div className={styles.accordionHeader}>
        <div>
          <div className={styles.dropdownHeader}>Announcements</div>
        </div>
        <div>
          {announcements.map((announcement, idx) => (
            <CommunicateItem
              key={`${announcement.title}-${idx}`}
              id={id}
              announcement={announcement}
              idx={idx}
              triggerClassModuleRefresh={triggerClassModuleRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
