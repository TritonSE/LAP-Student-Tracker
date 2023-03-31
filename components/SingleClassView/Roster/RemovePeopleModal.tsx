import React, { useContext, useState, useEffect } from "react";
import { APIContext } from "../../../context/APIContext";
import { Autocomplete, Dialog, DialogContent } from "@mui/material";
import TextField from "@mui/material/TextField";
import { User } from "../../../models";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";

type RemovePeopleModal = {
    showModal: boolean;
    handleClose: () => void;
    refreshRoster: () => Promise<void>
    classId: string;
    currentUsersInClass: User[];
};

const RemovePeopleModal: React.FC<RemovePeopleModal> = ({
    showModal,
    handleClose,
    classId,
    refreshRoster,
    currentUsersInClass
}) => {
    const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const client = useContext(APIContext);

    const onConfirmClick = async (): Promise<void> => {
        setLoading(true)
        const promises = []
        for (const idx in selectedPeople) {
            promises.push(client.deleteCommitment(classId, selectedPeople[idx]))
        }
        await Promise.all(promises);
        await refreshRoster()
        setLoading(false)
        handleClose()
    }

    return (
        <Dialog
            PaperProps={{
                style: { borderRadius: 10, width: 500 },
            }}
            open={showModal}
            onClose={handleClose}
        >
            <ModalHeader title={"Remove Users"} />
            <DialogContent>
                <Autocomplete
                    multiple
                    limitTags={10}
                    id="user-input-delete-class"
                    options={currentUsersInClass}
                    onChange={(event, value) => setSelectedPeople(value.map((user) => user.id))}
                    getOptionLabel={(user) => user.firstName + " " + user.lastName}
                    renderInput={(params) => (
                        <TextField {...params} label="Users" placeholder="Users" />
                    )}
                    isOptionEqualToValue={(userA, userB) => userA.id === userB.id}
                    sx={{ width: 435 }}
                />
            </DialogContent>
            <ModalActions handleSubmit={onConfirmClick} handleCancel={handleClose} loading={loading} />
        </Dialog>
    );
};

export { RemovePeopleModal }