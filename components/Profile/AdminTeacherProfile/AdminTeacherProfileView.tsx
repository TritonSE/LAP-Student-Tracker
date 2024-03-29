import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileViewLeft } from "./ProfileViewLeft";
import { ProfileViewRight } from "./ProfileViewRight";
import styles from "./AdminTeacherProfile.module.css";
import { CustomError } from "../../util/CustomError";
import { useRouter } from "next/router";
import { APIContext } from "../../../context/APIContext";
import { UpdateImage, User } from "../../../models/";
import { fromByteArray } from "base64-js";
import imageCompression from "browser-image-compression";

// component that renders the admin/teacher profile page
type AdminTeacherProfileViewProps = {
  otherUser?: User; // if we need to display a user that is not the logged in one, pass the details here
};
const AdminTeacherProfileView: React.FC<AdminTeacherProfileViewProps> = ({ otherUser }) => {
  const { user: loggedInUser, error, updateUser, clearError, logout } = useContext(AuthContext);

  const api = useContext(APIContext);

  // user will never be null, because if it is, client is redirected to login page
  if (loggedInUser == null) return <CustomError />;

  const router = useRouter();
  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null | undefined>(
    loggedInUser.phoneNumber
  );
  const [email, setEmail] = useState<string>(loggedInUser.email);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  // the user being displayed
  const [user, _setUser] = useState<User>(otherUser ? otherUser : loggedInUser);
  // if a custom user is being rendered, make it not editable
  const [editable, _setEditable] = useState<boolean>(otherUser == undefined);

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
        newPassword
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
  const validToSave = validPhoneNumber && validPassword && validEmail && validConfirmPassword;

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

  return (
    <div className={styles.rectangleContainer}>
      <div className={styles.rectangle}>
        <div className={styles.contentContainer}>
          <div className={styles.leftContainer}>
            <ProfileViewLeft
              firstName={user.firstName}
              lastName={user.lastName}
              editProfileClicked={editProfileClicked}
              handleEditProfileClicked={handleEditProfileClicked}
              validInput={validToSave}
              image={image}
              imageLoading={imageLoading}
              onImageChange={handleImageChange}
              onError={setErrorMessage}
              editable={editable}
              role={user.role}
              id={user.id}
            ></ProfileViewLeft>
          </div>
          <div className={styles.rightContainer}>
            <ProfileViewRight
              email={email}
              role={user.role}
              phoneNumber={phoneNumber}
              currentPassword={currentPassword}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              disabled={!editProfileClicked}
              errorMessage={errorMessage}
              editable={editable}
              handleEmailChange={handleEmailChange}
              handleCurrentPasswordChange={handleCurrentPasswordChange}
              handleConfirmPasswordChange={handleConfirmPassword}
              handlePasswordChange={handleNewPassword}
              handlePhoneNumberChange={handlePhoneNumberChange}
              onBackClick={onBackClick}
              onSignoutClick={onSignoutClick}
            ></ProfileViewRight>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminTeacherProfileView };
