import React from "react"
import { TextField } from '@mui/material';
import styles from "../../styles/components/ProfileInput.module.css"

type ProfileInputProps = {
  label: string,
  defaultValue: any
  disabled: boolean
}

const cssTextField = {
  width: 540,
  height: 80,
};

const ProfileInput: React.FC<ProfileInputProps> = ({ label, defaultValue, disabled }) => {
  return (
    <TextField
      id="outlined-basic"
      label="Email"
      variant="outlined"
      color="warning"
      sx={cssTextField}
      InputProps={{
        classes: {
          input: styles.font
        }
      }}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  )
}

export { ProfileInput }