import React, { useContext } from "react";
import { NextApplicationPage } from "../_app";
import { useRouter } from "next/router";
import { CustomError } from "../../components/util/CustomError";
import { AdminTeacherProfileView } from "../../components/Profile/AdminTeacherProfile/AdminTeacherProfileView";
import useSWR from "swr";
import { APIContext } from "../../context/APIContext";
import { CustomLoader } from "../../components/util/CustomLoader";

const OtherUserProfile: NextApplicationPage = () => {
  const router = useRouter();
  const api = useContext(APIContext);
  const userId = router.query.userId as string;

  const { data: user, error } = useSWR(`api/user/${userId}`, () => api.getUser(userId));

  if (error) return <CustomError />;
  if (user == null) return <CustomLoader />;

  return <AdminTeacherProfileView otherUser={user} />;
};
OtherUserProfile.requireAuth = true;
OtherUserProfile.title = "Profile";

export default OtherUserProfile;
