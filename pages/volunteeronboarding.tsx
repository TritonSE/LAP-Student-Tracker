import { useRouter } from "next/router";
import React, {useContext, useEffect, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/VolunteerOnboarding.module.css";
import TextField from "@mui/material/TextField";
import { AvailabilityModal } from "../components/Home/ManageAvailabilityWizard/AvailabilityModal";
import {User} from "../models";
import Button from "@mui/material/Button";

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
    const { user } = useContext(AuthContext);
    console.log(user);
    if ( !user || user.role != "Volunteer"){
        router.push("/home");
    }

    // done to appease TS
    const currUser = user as User;

    const [stage, setStage] =  useState<number>(1);
    const [address, setAddress] = useState<string>("");
    const [secondStageDone, setSecondStageDone] = useState(false);
    const [introduction, setIntroduction] = useState<string>("");
    const [experience, setExperience] = useState<string>("");
    const [showManageAvailability, setShowManageAvailability] = useState(false);

    const handleClose = (): void => {
        setShowManageAvailability(false);
    };

    useEffect( () => {
        setSecondStageDone(introduction != "" && experience != "");
    }, [introduction, experience]);


    const handleNextButton = () => {
        if (stage == 1) {
            setStage(stage+1);
        }
        else if (stage == 2 && secondStageDone) {
            setStage(stage+1);
        }
    }

    const handlePrevButton = () => {
        if(stage > 1) {
            setStage(stage - 1);
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
                    {stage == 1 && (
                        <h1 className={styles.title}>Basic Information</h1>
                    )}
                    {stage == 2 && (
                        <h1 className={styles.title}>Questions</h1>
                    )}
                    {stage == 3 && (
                        <h1 className={styles.title}>Schedule Interview</h1>
                    )}
                    <hr className={styles.divider}></hr>
                    {stage == 1 && (
                        <div className={styles.firstStageContainer}>
                            <TextField
                                id="filled-basic"
                                disabled
                                value={currUser.firstName}
                                type="text"
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                            />
                            <TextField
                                id="filled-basic"
                                type="text"
                                disabled
                                value={currUser.lastName}
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
                            />
                            <TextField
                                id="filled-basic"
                                type="text"
                                value={currUser.email}
                                disabled
                                color="warning"
                                InputProps={{ disableUnderline: true }}
                                sx={cssTextField}
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
                    {stage == 3 && (
                        <button 
                            className={styles.availabilityButton}
                            onClick={() => setShowManageAvailability(true)}
                        >
                            Enter your availability now
                        </button>
                    )}
                    {showManageAvailability ? (
                        <AvailabilityModal handleClose={handleClose} userId={currUser.id} />
                    ) : null}
                    {stage <= 3 && (
                        <div>
                            <Button className={styles.prevButton} variant="outlined" onClick={() => handlePrevButton()}>
                                Previous
                            </Button>
                            <Button className={styles.nextButton} disabled={stage > 1 && !secondStageDone} variant="contained" onClick={() => handleNextButton()}>
                                Next
                            </Button>
                        </div>


                    )}
                </div>
            </div>
        </div>
    );

}

export default VolunteerSignUp;