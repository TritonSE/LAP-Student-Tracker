import React, { useContext, useEffect, useState } from "react";
import { APIContext } from "../../../context/APIContext";
import { AuthContext } from "../../../context/AuthContext";
import Button from "@mui/material/Button";
import styles from "./communicate.module.css";
import { Announcement } from "../../../models";
import { CustomError } from "../../util/CustomError";
import { CommunicateItem } from "./CommunicateItem";
import { Dialog, DialogContent } from "@mui/material";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";
import TextField from "@mui/material/TextField";

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
  const [loading, setLoading] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await api.getAnnouncements(id);
      setAnnouncements(res);
    })();
  }, [refresh]);

  useEffect(() => {
    if (title == "" || content == "") {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
  }, [title, content]);

  const handleClick: VoidFunction = () => {
    setPopup(!popup);
  };

  const handleCancel = async (): Promise<void> => {
    setPopup(false);
  };

  const handleSubmit = async (): Promise<void> => {
    if (title == "" || content == "") {
      // setError(true);
    } else {
      setLoading(true);
      const announcement = {
        title: title,
        content: content,
      };
      await api.createAnnouncement(id, announcement);
      triggerClassModuleRefresh();
      // setError(false);
      setPopup(false);
      setTitle("");
      setContent("");
      setLoading(false);
    }
  };

  const triggerClassModuleRefresh = (): void => {
    setRefresh(!refresh);
  };

  if (user == null) return <CustomError />;

  return (
    <div className={styles.container}>
      {popup ? (
        <Dialog
          PaperProps={{
            style: { borderRadius: 10, width: 600 },
          }}
          open={popup}
          onClose={handleCancel}
        >
          <ModalHeader title={"Create Announcement"} />

          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="announcement-title"
              label="Title"
              value={title}
              fullWidth
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              id={"filled-basic"}
              rows={6}
              // sx = {cssBigTextField}
              multiline={true}
              autoFocus
              margin="dense"
              label="Content"
              value={content}
              fullWidth
              variant="standard"
              onChange={(e) => setContent(e.target.value)}
            />
            {/*<br/>*/}
            {/*<div>*/}
            {/*  /!*{error ? "An Error Occured" : null} </div>*!/*/}
          </DialogContent>
          <ModalActions
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            loading={loading}
            disableSubmit={disableSubmit}
          />
        </Dialog>
      ) : null}

      <div className={styles.title}>
        Communicate
        {(user.role == "Teacher" || user.role == "Admin") && (
          <>
            <Button className={styles.button} onClick={handleClick}>
              + New Post
            </Button>
          </>
        )}
      </div>
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
