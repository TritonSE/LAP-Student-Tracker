import React, { useEffect, useState } from "react";
import styles from "./ParentEditProfilePanel.module.css";
import { CustomLoader } from "../../util/CustomLoader";
import { ProfilePicture } from "./ProfilePicture";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { AuthState } from "../../../context/AuthContext";
import { LeagueAPI } from "../../../context/LeagueAPI";
import { UpdateImage, User } from "../../../models";
import { fromByteArray } from "base64-js";
import imageCompression from "browser-image-compression";
import { ProfileInput } from "./ProfileInput";

type ParentEditProfilePanelProps = {
  loggedInUser: User;
  authState: AuthState;
  leagueAPI: LeagueAPI;
  customUser: boolean;
};

// Component for left hand side of the parent profile view.
// Displays parent profile info and allows for editing, including name, phone, email, birthday, address, and password
const ParentEditProfilePanel: React.FC<ParentEditProfilePanelProps> = ({
  loggedInUser,
  authState,
  leagueAPI,
  customUser,
}) => {
  const { error, updateUser, clearError, logout } = authState;

  const api = leagueAPI;

  const router = useRouter();
  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(
    loggedInUser.phoneNumber
  );
  const [email, setEmail] = useState<string>(loggedInUser.email);
  const [address, setAddress] = useState<string>(loggedInUser.address || "");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  // the user being displayed
  const [user, _setUser] = useState<User>(loggedInUser);
  // if a custom user is being rendered, make it not editable
  const [editable, _setEditable] = useState<boolean>(customUser);

  useEffect(() => {
    (async () => {
      await resetImage();
    })();
  }, []);

  const resetImage = async (): Promise<void> => {
    setImageLoading(true);
    const image = await api.getImage(loggedInUser.pictureId);
    if (image.img == null) {
      setImage(null);
    } else {
      const buf = Buffer.from(image.img, "base64");
      const fileBits = new Uint8Array(buf);
      const f = new File([fileBits], "");
      setImage(f);
    }
    setImageLoading(false);
  };

  const handleEditProfileClicked = async (): Promise<void> => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else {
      clearError();
      setErrorMessage("");

      // compress image and make sure that the file can be compressed
      if (imageChanged && image != null) {
        const imageFile = image;
        const options = {
          maxSizeMB: 3,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(imageFile, options);
          setImage(compressedFile);
        } catch {
          setErrorMessage("Something went wrong. Try a smaller file...");
          return;
        }
      }

      const userSuccess = await updateUser(
        loggedInUser.id,
        loggedInUser.email,
        currentPassword,
        email,
        phoneNumber,
        newPassword,
        address
      );
      let imageSuccess = true;
      if (imageChanged && image != null && userSuccess) {
        const imageType = image.type;
        const imageData = await image.arrayBuffer();
        const imageDataBits = new Uint8Array(imageData);
        const b64img = fromByteArray(imageDataBits);
        const updatedImage: UpdateImage = {
          mimeType: imageType,
          img: b64img,
        };
        const updatedImageFromDB = api.updateImage(loggedInUser.pictureId, updatedImage);
        if (!updatedImageFromDB) imageSuccess = false;
      }
      if (userSuccess && imageSuccess) {
        setEditProfileClicked(false);
        setImageChanged(false);
      }
    }
  };

  const onBackClick = async (): Promise<void> => {
    setPhoneNumber(loggedInUser.phoneNumber);
    setEmail(loggedInUser.email);
    setAddress(loggedInUser.address || "");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    clearError();
    setErrorMessage("");
    setEditProfileClicked(false);
    await resetImage();
  };

  const onSignoutClick = (): void => {
    logout();
    router.push("/login");
  };

  const handleEmailChange = (newEmail: string): void => {
    setEmail(newEmail);
  };

  const handlePhoneNumberChange = (newNumber: string): void => {
    setPhoneNumber(newNumber);
  };

  const handleAddressChange = (newAddress: string): void => {
    setAddress(newAddress);
  };

  const handleCurrentPasswordChange = (newVal: string): void => {
    setCurrentPassword(newVal);
  };

  const handleNewPassword = (newPassword: string): void => {
    setNewPassword(newPassword);
  };

  const handleConfirmPassword = (confirmPassword: string): void => {
    setConfirmPassword(confirmPassword);
  };

  const handleImageChange = (newImage: File): void => {
    setImageChanged(true);
    setImage(newImage);
  };

  const regEx = RegExp(/\S+@\S+\.\S+/);
  const validEmail = regEx.test(email);
  const phoneRegEx = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  const validPhoneNumber =
    phoneNumber === null ||
    phoneNumber === "" ||
    (phoneNumber != undefined &&
      !/[a-z]/i.test(phoneNumber) &&
      phoneRegEx.test(phoneNumber) &&
      !(phoneNumber.length > 11));
  const validPassword = newPassword === "" || newPassword.length > 6;
  const validConfirmPassword = newPassword === confirmPassword;
  const validInput = validPhoneNumber && validPassword && validEmail && validConfirmPassword;

  useEffect(() => {
    clearError();
  }, []);
  useEffect(() => {
    setErrorMessage(
      error != null
        ? error.message
        : !validEmail
        ? "Enter a valid email"
        : !validPhoneNumber
        ? "Enter a valid phone number"
        : !validPassword
        ? "Passwords must be at least 6 characters"
        : !validConfirmPassword
        ? "Passwords do not match"
        : ""
    );
  }, [validEmail, validPassword, validPhoneNumber, validConfirmPassword, error]);
  const buttonText = editProfileClicked ? "Save" : "Edit Profile";
  const disabled = !editProfileClicked;

  return (
    <div className={styles.container}>
      <div className={styles.profilePictureContainer}>
        <div className={styles.circlePadding}></div>
        {imageLoading ? (
          <CustomLoader />
        ) : (
          <ProfilePicture
            profileEditable={editProfileClicked}
            onImageChange={handleImageChange}
            firstName={user.firstName}
            lastName={user.lastName}
            image={image}
            onError={setErrorMessage}
          />
        )}
        <div className={styles.name}> {user.firstName + " " + user.lastName}</div>
        <hr className={styles.divider} />
      </div>
      <div className={disabled ? styles.inputContainerDefault : styles.inputContainerWithPassword}>
        <ProfileInput
          label="Phone Number"
          defaultValue={phoneNumber ? phoneNumber : ""}
          disabled={disabled}
          onContentChange={handlePhoneNumberChange}
        />
        <ProfileInput
          label="Email"
          defaultValue={email}
          disabled={disabled}
          onContentChange={handleEmailChange}
        />
        <ProfileInput label="Role" defaultValue={"Parent"} disabled={true} />
        <ProfileInput
          label="Address"
          defaultValue={address}
          disabled={disabled}
          onContentChange={handleAddressChange}
        />
        {!disabled && [
          <ProfileInput
            key="Password"
            label="Password"
            defaultValue={currentPassword}
            disabled={disabled}
            onContentChange={handleCurrentPasswordChange}
            password={true}
          />,
          <ProfileInput
            key="New Password"
            label="New Password"
            defaultValue={newPassword}
            disabled={disabled}
            password={true}
            onContentChange={handleNewPassword}
          />,
          <ProfileInput
            key="Confirm Password"
            label="Confirm Password"
            defaultValue={confirmPassword}
            disabled={disabled}
            onContentChange={handleConfirmPassword}
            password={true}
          />,
        ]}

        <div className={styles.errorMessage}> {errorMessage} </div>

        {editable ? (
          <div className={styles.buttonContainer}>
            {!disabled && (
              <Button
                variant="contained"
                className={styles.backButton}
                onClick={() => onBackClick()}
              >
                <div className={styles.backText}>Back</div>
              </Button>
            )}
            <Button
              disabled={!validInput}
              variant="contained"
              onClick={async () => await handleEditProfileClicked()}
              className={styles.editButton}
            >
              {" "}
              {buttonText}
            </Button>
            <Button
              variant="contained"
              className={styles.signOutButton}
              onClick={() => onSignoutClick()}
            >
              <div className={styles.signOutText}>Sign Out</div>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { ParentEditProfilePanel };
