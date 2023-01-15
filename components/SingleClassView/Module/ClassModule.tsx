import React, { useContext, useEffect, useState } from "react";
import styles from "./modules.module.css";
import { APIContext } from "../../../context/APIContext";
import { CustomLoader } from "../../util/CustomLoader";
import { Module } from "../../../models";
import Button from "@mui/material/Button";
import { AccordionModule } from "./AccordionModule";
import { AuthContext } from "../../../context/AuthContext";
import { CustomError } from "../../util/CustomError";

type ModuleProps = {
  id: string;
  enableEditing: boolean;
};

export const ClassModule: React.FC<ModuleProps> = ({ id }) => {
  const api = useContext(APIContext);
  const { user } = useContext(AuthContext);

  if (user == null) return <CustomError />;
  const [modules, setModules] = useState<Module[]>([]);
  const [popup, setPopup] = useState(false);
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await api.getClassModules(id);
      res.sort((a, b) => {
        return a > b ? -1 : 1;
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
    const module = {
      classId: id,
      name: name,
      position: modules.length + 1,
      moduleId: "",
    };
    await api.createModule(module);
    setRefresh(!refresh);
    setPopup(false);
    setName("");
  };

  const handleCancel = async (): Promise<void> => {
    setPopup(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        Modules{" "}
        {(user.role == "Teacher" || user.role == "Admin") && (
          <Button className={styles.button} onClick={handleClick}>
            Add module
          </Button>
        )}
      </div>
      {popup ? (
        <div className={styles.popupBackground}>
          <div className={styles.popupContainer}>
            <div className={styles.popupTitle}>Create Module</div>
            <input
              className={`${styles.label} ${styles.classInput}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Module Name"
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
            />
          );
        })
      )}
    </div>
  );
};
