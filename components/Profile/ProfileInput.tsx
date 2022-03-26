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

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordChange = (): void => {
    setShowPassword(!showPassword);
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
        endAdornment: password && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => togglePasswordChange()}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      type={password == undefined ? "text" : showPassword ? "text" : "password"}
      defaultValue={defaultValue != null ? defaultValue : ""}
      disabled={disabled}
      onChange={(e) => handleContentChange(e.target.value)}
    />
  );
};

export { ProfileInput };
