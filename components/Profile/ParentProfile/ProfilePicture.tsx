import React, { useEffect, useRef, useState } from "react";
import { Avatar, SxProps } from "@mui/material";
import styles from "./ProfilePicture.module.css";

type ProfilePictureProps = {
  profileEditable: boolean;
  onImageChange: (img: File) => void;
  firstName: string;
  lastName: string;
  image: File | null;
  onError: (errorMsg: string) => void;
};

// handles uploading and displaying a profile picture
export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profileEditable,
  onImageChange,
  firstName,
  lastName,
  image,
  onError,
}) => {
  // console.log(lastName)
  const fileInput = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const acceptableMimeType = ["image/png", "image/jpeg"];

  useEffect(() => {
    if (image != null) {
      setPreviewUrl(URL.createObjectURL(image));
    }
  }, [image]);

  const handleOnDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
  };

  const handleOnDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (!profileEditable) return;
    const imageFile = e.dataTransfer.files[0];
    if (imageFile != null && acceptableMimeType.indexOf(imageFile.type) == -1) {
      onError("File must be of type jpeg or png");
      return;
    } else {
      handleFile(imageFile);
    }
  };

  const handleFile = (file: File): void => {
    if (file != null) {
      onImageChange(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // generates color of avatar bubble from string
  const stringToColor = (string: string): string => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  type StringAvatarProps = {
    sx: SxProps;
    children: string;
  };

  const stringAvatar = (name: string): StringAvatarProps => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 180,
        height: 180,
        fontSize: 80,
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  return (
    <div
      className={styles.dropZone}
      onDragOver={handleOnDragOver}
      onDrop={handleOnDrop}
      onClick={() => {
        if (fileInput.current != null && profileEditable) fileInput.current.click();
      }}
    >
      <div className={profileEditable ? styles.dropZoneContent : styles.dropZoneContentDisabled}>
        {image != null ? (
          <Avatar
            alt={firstName + " " + lastName}
            src={previewUrl}
            sx={{ width: 180, height: 180 }}
          />
        ) : (
          <Avatar {...stringAvatar(firstName + " " + lastName)} />
        )}
        <input
          type={"file"}
          ref={fileInput}
          hidden
          accept={"image/png, image/jpeg"}
          onChange={(e) => {
            if (e.target != null && e.target.files != null) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
};
