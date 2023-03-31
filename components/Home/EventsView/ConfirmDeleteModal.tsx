import React, { useContext, useState } from "react";
import { Dialog } from "@mui/material";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";
import { APIContext } from "../../../context/APIContext";

type ConfirmDeleteModal = {
  closeModal: () => void;
  refreshClasses: () => Promise<void>;
  classId: string;
  modalOpen: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModal> = ({
  closeModal,
  classId,
  modalOpen,
  refreshClasses,
}) => {
  const [open, setOpen] = useState(modalOpen);
  const api = useContext(APIContext);
  const [loading, setLoading] = useState(false);
  const handleClose = (): void => {
    closeModal();
    setOpen(false);
  };

  const deleteClass = async (): Promise<void> => {
    setLoading(true);
    await api.deleteEvent(classId);
    await refreshClasses();
    closeModal();
    setOpen(false);
    setLoading(false);
    return;
  };

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 10, width: 450 },
      }}
      open={open}
      onClose={handleClose}
    >
      <ModalHeader title={"Are You Sure?"} />
      <ModalActions handleSubmit={deleteClass} handleCancel={handleClose} loading={loading} />
    </Dialog>
  );
};

export { ConfirmDeleteModal };
