import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import styles from "../../styles/components/ProfileInput.module.css";
import { IconButton, InputAdornment } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
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

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  defaultValue,
  disabled,
  password,
  onContentChange,
}) => {
  const handleContentChange = (newContent: string): void => {
    if (!onContentChange) return;
    else onContentChange(newContent);
    return;
  };

  return (
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
  );
};

export { ProfileInput };
