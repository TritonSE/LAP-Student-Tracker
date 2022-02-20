import React from "react";
import TextField from '@mui/material/TextField';

const InputBox: React.FC<{ text: string }> = ({ text }) => {

    let title: string
    let type: string

    title = text[0].toUpperCase() + text.substring(1); //capatalize first letter of text

    if (text == "password"){
        type = "password"
    }
    else{
        type = "text"
    }

    return (
        <TextField
        id="filled-basic" 
        label={title}
        variant="filled"
        type={type}
        color="warning"
        //value={email}
        //onChange={handleChange}
        InputProps = {{
            disableUnderline: true,
        }}
        sx = {{
            color: "black",
            width: 690,
            height: 80,
            '& .MuiFilledInput-input': {
            color: "#000000"
            },
            '& .MuiFormLabel-root': {
                color: "#494C4E"
                },
        }}
        />
    )

};



export default InputBox;