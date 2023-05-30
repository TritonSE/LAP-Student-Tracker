import React, { useContext, useState, useEffect } from "react";
import { APIContext } from "../../../context/APIContext";
import { Autocomplete, Dialog, DialogContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import { User } from "../../../models";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";

type AddPeopleModalProps = {
  showModal: boolean;
  handleClose: () => void;
  refreshRoster: () => Promise<void>;
  classId: string;
  currentUsersInClass: User[];
};

const AddPeopleModal: React.FC<AddPeopleModalProps> = ({
  showModal,
  handleClose,
  classId,
  refreshRoster,
  currentUsersInClass,
}) => {
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [allAddableUsers, setAllAddableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const client = useContext(APIContext);

  useEffect(() => {
    (async () => {
      const allUsersSet = new Set(currentUsersInClass.map((user) => user.id));
      const allUsers = await client.getAllUsers(undefined, true);
      const allAddableUsers = allUsers.filter((user) => {
        if (user.role == "Parent") {
          return false;
        }

        const userAlreadyInClass = allUsersSet.has(user.id);
        // if user already in class, dont allow them to be in the list to add people
        return !userAlreadyInClass;
      });

      setAllAddableUsers(allAddableUsers);
    })();
  }, []);

  const onConfirmClick = async (): Promise<void> => {
    setLoading(true);
    const promises = [];
    for (const idx in selectedPeople) {
      promises.push(addUser(selectedPeople[idx]));
    }
    await Promise.all(promises);
    await refreshRoster();
    setLoading(false);
    handleClose();
  };

  const addUser = async (userId: string): Promise<void> => {
    await client.createCommitment(classId, userId);
  };

  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: 10, width: 500 },
      }}
      open={showModal}
      onClose={handleClose}
    >
      <ModalHeader title={"Add Users"} />
      <DialogContent>
        <Autocomplete
          multiple
          limitTags={10}
          id="user-input"
          options={allAddableUsers}
          onChange={(event, value) => setSelectedPeople(value.map((user) => user.id))}
          getOptionLabel={(user) => user.firstName + " " + user.lastName}
          renderInput={(params) => <TextField {...params} label="Users" placeholder="Users" />}
          isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
          sx={{ width: 435 }}
        />
      </DialogContent>
      <ModalActions handleSubmit={onConfirmClick} handleCancel={handleClose} loading={loading} />
    </Dialog>
  );
};

export { AddPeopleModal };
