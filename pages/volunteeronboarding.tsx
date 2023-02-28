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

const cssBigTextField = {
    color: "black",
    width: 690,
    height: 150,
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

    const handleNextButton = () => {
        if (stage == 1 && firstStageDone) {
            setNextStage(stage+1);
        }
        else if (stage == 2 && secondStageDone) {
            setNextStage(stage+1);
        }
    }

    return (
        <div>
            <div className={styles.headerContainer}>
                <img src="logo1.png"></img>
                <img src="logo2.png"></img>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.progressContainer}>
                    <div className={styles.progress}>
                        {stage == 1 &&
                            <div className={styles.progressItems}>
                                <div className={styles.circleOrange}>
                                    <div className={styles.stageNumber}>1</div>
                                </div>
                                <div className={styles.circleGray}>
                                    <div className={styles.stageNumber}>2</div>
                                </div>
                                <div className={styles.circleGray}>
                                    <div className={styles.stageNumber}>3</div>
                                </div>
                            </div>
                        }
                        {stage == 2 &&
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
                        }
                        {stage == 3 &&
                            <div className={styles.progressItems}>
                                <div className={styles.circleOrange}>
                                    <div className={styles.checkmark}></div>
                                </div>
                                <div className={styles.circleOrange}>
                                    <div className={styles.checkmark}></div>
                                </div>
                                <div className={styles.circleOrange}>
                                    <div className={styles.stageNumber}>3</div>
                                </div>
                            </div>
                        }
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
                    {stage == 1 && (
                        <div className={styles.firstStageContainer}>
                            <TextField
                                id="filled-basic"
                                label="First Name"
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Last Name"
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Email"
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="Address"
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <TextField
                                id="filled-basic"
                                label="City"
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                    )}
                    {stage == 2 && (
                        <div className={styles.secondStageContainer}>
                            <div>
                                <h3 className={styles.questionPrompt}>Tell us about yourself.</h3>
                                <TextField
                                    id="filled-basic"
                                    multiline={true}
                                    rows={5}
                                    type="text"
                                    color="warning"
                                    InputProps={{ disableUnderline: true }}
                                    sx={cssBigTextField}
                                    onChange={(e) => setIntroduction(e.target.value)}
                                />
                            </div>
                            <div>
                                <h3 className={styles.questionPrompt}>What relevant experience do you have?</h3>
                                <TextField
                                    id="filled-basic"
                                    multiline={true}
                                    rows={5}
                                    type="text"
                                    color="warning"
                                    InputProps={{ disableUnderline: true }}
                                    sx={cssBigTextField}
                                    onChange={(e) => setExperience(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {stage == 3 && (
                        <div className={styles.thirdStageContainer}>
                            <p className={styles.text}>Please schedule an interview with a representative from The League. Enter your availability for the next 7-10 busines days below</p>
                        </div>
                    )}
                    {stage < 3 && (
                        <button className={styles.nextButton} onClick={() => handleNextButton()}>
                            Next
                        </button>
                    )}
                    {stage == 3 && (
                        <button className={styles.availabilityButton}>
                            Enter your availability now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

}

export default VolunteerSignUp;