import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ProfileViewLeft } from "./ProfileViewLeft";
import { ProfileViewRight } from "./ProfileViewRight";
import styles from "./AdminTeacherProfile.module.css";
import { Error } from "../../util/Error";
import { useRouter } from "next/router";
import {APIContext} from "../../../context/APIContext";
import {UpdateImage} from "../../../models/images";

// component that renders the admin/teacher profile page
const AdminTeacherProfileView: React.FC = () => {
  const { user, error, updateUser, clearError, logout } = useContext(AuthContext);
  const  api= useContext(APIContext);

  // user will never be null, because if it is, client is redirected to login page
  if (user == null) return <Error />;

  const router = useRouter();
  const [editProfileClicked, setEditProfileClicked] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined | null>(user.phoneNumber);
  const [email, setEmail] = useState<string>(user.email);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imageChanged, setImageChanged] = useState<boolean>(false);

  useEffect( () => {
    (async () => {
      const image = await api.getImage(user.pictureId);
      if (image == null) setImage(null);
      else {
        const f = new File([image], '');
        setImage(f);
        console.log(f);
        console.log("has image been changed");
      }
    })();
    console.log("use effect running");
  }, []);

  useEffect( () => {
    console.log("IMAGE CHANGED")
    console.log(image);

  }, [image]);
  const handleEditProfileClicked = async (): Promise<void> => {
    if (!editProfileClicked) {
      setEditProfileClicked(true);
    } else {
      clearError();
      setErrorMessage("");

      const userSuccess = await updateUser(
        user.id,
        user.email,
        currentPassword,
        email,
        phoneNumber,
        newPassword
      );
      let imageSuccess = true;
      if (imageChanged && image != null) {
        const imageType = image.type;
        const imageData = await image.arrayBuffer();
        console.log("IMAGE UPLOADED ARRAY");
        console.log(imageData);
        const updatedImage: UpdateImage = {
          mimeType: imageType,
          img: new Uint8Array(imageData)
        };
        const updatedImageFromDB = api.updateImage(user.pictureId, updatedImage);
        if (!updatedImageFromDB) imageSuccess = false;
      }
      if (userSuccess && imageSuccess) setEditProfileClicked(false);
    }
  };

  const onBackClick = (): void => {
    setPhoneNumber(user.phoneNumber);
    setEmail(user.email);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    clearError();
    setErrorMessage("");
    setEditProfileClicked(false);
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
    console.log("IMAGE THAT IS UPLOADED")
    console.log(newImage);
  }

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
              onImageChange={handleImageChange}
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
