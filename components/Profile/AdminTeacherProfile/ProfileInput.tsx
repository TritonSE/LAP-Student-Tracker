import React from "react";
import TextField from "@mui/material/TextField";
import styles from "./ProfileInput.module.css";

type ProfileInputProps = {
  label: string;
  defaultValue: string | null;
  disabled: boolean;
  password?: boolean;
  onContentChange?: (newValue: string) => void;
};

const cssTextField = {
  width: 540,
  height: 80,
};

// component that handles the textboxes for the admin profile view
const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  defaultValue,
  disabled,
  password,
  onContentChange,
}) => {
  // on content change not always defined because some fields cannot be changed
  const handleContentChange = (newContent: string): void => {
    if (!onContentChange) return;
    else onContentChange(newContent);
    return;
  };

  return (
    <div className={styles.textBoxPadding}>
      <TextField
        id="filled-basic"
        label={label}
        variant="filled"
        color="warning"
        sx={cssTextField}
        InputProps={{
          classes: {
            input: styles.font,
          },
        }}
        type={password == undefined ? "text" : "password"}
        value={defaultValue != null ? defaultValue : ""}
        disabled={disabled}
        onChange={(e) => handleContentChange(e.target.value)}
      />
    </div>
  );
};

export { ProfileInput };
