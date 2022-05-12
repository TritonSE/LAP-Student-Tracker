import React, {useEffect, useRef, useState} from "react";
import styles from "./ProfileViewLeft.module.css";
import {Avatar} from "@mui/material";
import Stack from '@mui/material/Stack';

type ProfileViewLeftProps = {
  firstName: string;
  lastName: string;
  image: File | null;
  editProfileClicked: boolean;
  validInput: boolean;
  onImageChange: (img: File) => void;
  handleEditProfileClicked: () => Promise<void>;

};

// component for left hand side of the profile view. Display first and last names, as well as edit profile button
// TODO: setup profile picture upload
const ProfileViewLeft: React.FC<ProfileViewLeftProps> = ({
  firstName,
  lastName, image,
  editProfileClicked,
  validInput, onImageChange,
  handleEditProfileClicked,
}) => {
  const buttonText = editProfileClicked ? "Save" : "Edit Profile";

    const fileInput = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const acceptableMimeType = ["image/png", "image/jpeg"];

    useEffect( () => {
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
        if (!editProfileClicked) return;
        const imageFile = e.dataTransfer.files[0];
        if(imageFile != null && acceptableMimeType.indexOf(imageFile.type) == -1) {
            alert("Please enter a jpeg or a png file");
            return;
        }
        else {
            handleFile(imageFile);
        }
    };

    const handleFile = (file: File): void => {
        if(file != null) {
            onImageChange(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const stringToColor = (string: string) => {
        let hash = 0;
        let i;

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        /* eslint-enable no-bitwise */

        return color;
    }

    const stringAvatar = (name: string) => {
        return {
            sx: {
                bgcolor: stringToColor(name),
                width: 240,
                height: 240,
                fontSize: 80
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    };

  return (
    <div className={styles.rightContainer}>
      <div className={styles.circlePadding}></div>
        <div className={styles.dropZone} onDragOver={handleOnDragOver} onDrop={handleOnDrop} onClick={ () => {
            if (fileInput.current != null && editProfileClicked) fileInput.current.click();
        }}>
            <div className={styles.dropZoneContent}>
                {image != null ?<Avatar
                    alt={firstName + " " + lastName}
                    src={previewUrl}
                    sx={{ width: 240, height: 240 }}
                />: <Avatar { ...stringAvatar(firstName + " " + lastName)}/>}
                <input type={"file"} ref={fileInput} hidden accept={"image/png, image/jpeg"} onChange = { (e) => {
                    if(e.target != null && e.target.files != null){
                        handleFile(e.target.files[0]);
                    }
                }}/>
            </div>
        </div>
      <div className={styles.padding}></div>
      <div className={styles.name}> {firstName + " " + lastName}</div>
      <div className={styles.buttonPadding}></div>
      <div className={styles.center}>
        <button
          disabled={!validInput}
          onClick={async () => await handleEditProfileClicked()}
          className={styles.editButton}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export { ProfileViewLeft };
