// import styles from "../styles/components/Loading.module.css";
import React from "react";
// import { useRouter } from "next/router";
import ClipLoader from "react-spinners/ClipLoader";



const Loader: React.FC = () => {
    return(
        <div>
            <ClipLoader loading={true} size={30} />
        </div>
    )
}

export default Loader;
