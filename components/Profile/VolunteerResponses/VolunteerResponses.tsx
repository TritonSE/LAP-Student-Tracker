import React, {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../context/APIContext";
import {Dialog, DialogContent} from "@mui/material";
import TextField from "@mui/material/TextField";
import styles from "../../../styles/VolunteerOnboarding.module.css";

type VolunteerResponsesProps = {
    id: string
    open: boolean
    handleClose: () => void
};

// const cssTextField = {
//     color: "black",
//     width: 690,
//     height: 80,
//     "& .MuiFilledInput-input": {
//         color: "#000000",
//     },
//     "& .MuiFormLabel-root": {
//         color: "#494C4E",
//     },
// };

const cssBigTextField = {
    width: 650,
    height: 150,
    "& .MuiFilledInput-input": {
        color: "#000000",
    },
    "& .MuiFormLabel-root": {
        color: "#494C4E",
    },
};

const VolunteerResponsesView: React.FC<VolunteerResponsesProps> = ({
    id,
    open ,
    handleClose
}) => {

    const client = useContext(APIContext)

    const [about, setAbout] = useState("");
    const [experience, setExperience] = useState("")

    useEffect(() => {
        (async() => {
            try {
                const responses = await client.getResponses(id)
                setAbout(responses.about)
                setExperience(responses.experience)
            } catch (e) {
                //
            }}
        )();
    }, []);


    return (
        <div>
        <Dialog open={open}
                onClose={handleClose}
                maxWidth={false}
                PaperProps={{
                    style: { borderRadius: 10, maxWidth: 'xl', width: 700, height: 500 },
                }}>
            <DialogContent>
                <h3 className={styles.questionPrompt}>Tell us about yourself.</h3>
                <TextField
                    id="filled-basic"
                    multiline={true}
                    rows={5}
                    value={about}
                    type="text"
                    color="warning"
                    InputProps={{ disableUnderline: true }}
                    sx={cssBigTextField}
                    disabled
                />
                <h3 className={styles.questionPrompt}>What relevant experience do you have?</h3>
                <TextField
                    id="filled-basic"
                    multiline={true}
                    disabled
                    value={experience}
                    rows={5}
                    type="text"
                    color="warning"
                    InputProps={{ disableUnderline: true }}
                    sx={cssBigTextField}
                />
            </DialogContent>
        </Dialog>

        </div>
    );

};

export { VolunteerResponsesView }