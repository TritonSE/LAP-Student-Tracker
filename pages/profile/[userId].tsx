import React from "react";
import {NextApplicationPage} from "../_app";
import {useRouter} from "next/router";
import {CustomError} from "../../components/util/CustomError";
import {AdminTeacherProfileView} from "../../components/Profile/AdminTeacherProfile/AdminTeacherProfileView";

const OtherUserProfile: NextApplicationPage = () => {
    const router = useRouter();
    const userId = router.query.userId as string;


    if (userId == null) return <CustomError/>;

    return (
        <AdminTeacherProfileView userId={userId}/>
    );
};
OtherUserProfile.requireAuth = true;

export default OtherUserProfile;