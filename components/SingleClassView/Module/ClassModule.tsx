import React, { useContext, useEffect, useState } from "react";
import styles from "./modules.module.css";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { Module } from "../../../models";
import Button from "@mui/material/Button";
import { AccordionModule } from "./AccordionModule";
import { Dialog, DialogContent, TextField } from "@mui/material";
import { ModalActions, ModalHeader } from "../../util/ModalComponents";
import { AuthContext } from "../../../context/AuthContext";
import { CustomError } from "../../util/CustomError";

type ClassModuleProps = {
  id: string;
  enableEditing: boolean;
};



const ClassModule: React.FC<ClassModuleProps> = ({ id }) => {
  const api = useContext(APIContext);
  const { user } = useContext(AuthContext);

  if (user == null) return <CustomError />;
  const [modules, setModules] = useState<Module[]>([]);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api.getClassModules(id);
      res.sort((a, b) => {
        return a.position < b.position ? -1 : 1;
      });
      setModules(res);
    })();
  }, [refresh]);

  if (!modules) return <CustomLoader />;

  const handleClick: VoidFunction = () => {
    setPopup(!popup);
  };

  // helper function to delete the module within the state variable, so we do not have to delete the
  const deleteModuleWithinState = (id: string): void => {
    const updatedModules = modules.filter((module) => module.moduleId != id);
    setModules(updatedModules);
  };

  const triggerClassModuleRefresh = (): void => {
    setRefresh(!refresh);
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    const module = {
      classId: id,
      name: name,
      position: modules.length + 1,
      moduleId: "",
    };
    await api.createModule(module);
    setLoading(false);
    setRefresh(!refresh);
    setPopup(false);
    setName("");
  };

  const handleCancel = async (): Promise<void> => {
    setPopup(false);
  };

  const handleSave: VoidFunction = async () => {
    await api.updateClassModules(id, modules);
    setSave(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Modules{" "}
        {save ? (
          <Button className={styles.button} id="save-button" onClick={handleSave}>
            Save
          </Button>
        ) : user.role == "Teacher" || user.role == "Admin" ? (
          <Button className={styles.button} onClick={handleClick}>
            Add module
          </Button>
        ) : null}
      </div>
      {popup ? (
        <Dialog
          PaperProps={{
            style: { borderRadius: 10, width: 450 },
          }}
          open={popup}
          onClose={handleCancel}
        >
          <ModalHeader title={"Create Module"} />

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
          <ModalActions handleSubmit={handleSubmit} handleCancel={handleCancel} loading={loading} />
        </Dialog>
      ) : null}
      <div className={styles.spacer} />

      {modules.length === 0 ? (
        <div className={styles.title}>No modules found</div>
      ) : (
        modules.map((module, i) => {
          return (
            <AccordionModule
              key={`${module.name}-${i}`}
              module={module}
              numModules={modules.length}
              deleteModuleWithinState={deleteModuleWithinState}
              triggerClassModuleRefresh={triggerClassModuleRefresh}
              setSave={setSave}
              modules={modules}
              setModules={setModules}
            />
          );
        })
      )}
    </div>
  );
};

export { ClassModule };
