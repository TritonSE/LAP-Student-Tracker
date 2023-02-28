import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/VolunteerOnboarding.module.css";
import TextField from "@mui/material/TextField";

const cssTextField = {
    color: "black",
    width: 690,
    height: 80,
    "& .MuiFilledInput-input": {
      color: "#000000",
    },
    "& .MuiFormLabel-root": {
      color: "#494C4E",
    },
  };


const VolunteerSignUp: React.FC  = () => {
    const router = useRouter();
    const [stage, setNextStage] =  useState<number>(1);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [introduction, setIntroduction] = useState<string>("");
    const [experience, setExperience] = useState<string>("");

    // simlpe regex to check if input is a valid email
    const regEx = RegExp(/\S+@\S+\.\S+/);
    const validEmail = email == "" || regEx.test(email);

    const firstStageDone = 
        firstName != "" &&
        lastName != "" &&
        email != "" &&
        address != "" &&
        city != "" &&
        validEmail;
    
    const secondStageDone = introduction != "" && experience != "";

    return (
        <div>
            <div className={styles.headerContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.progressContainer}>
                    <div className={styles.progress}>
                        <div className={styles.progressItems}>
                            <div className={styles.circleOrange}>
                                <div className={styles.checkmark}></div>
                            </div>
                            <div className={styles.circleOrange}>
                                <div className={styles.stageNumber}>2</div>
                            </div>
                            <div className={styles.circleGray}>
                                <div className={styles.stageNumber}>3</div>
                            </div>
                        </div>
                        
                        <div className={styles.verticalDivider}></div>
                        <div className={styles.progressItems}>
                            <h2 className={styles.stagesText}>General</h2>
                            <h2 className={styles.stagesText}>Questions</h2>
                            <h2 className={styles.stagesText}>Schedule Interview</h2>
                        </div>
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <h1 className={styles.title}>Basic Information</h1>
                    <hr className={styles.divider}></hr>
                </div>
            </div>
        </div>
    );

}

export default VolunteerSignUp;