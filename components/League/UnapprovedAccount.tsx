import React, { useState } from "react";
import styles from "./LeagueViews.module.css";
import { User } from "../../models";
import Link from "next/link";
import LoadingButton from "@mui/lab/LoadingButton";

type UnapprovedAccountProps = {
  user: User;
  index: number;
  approveAccount: (user: User) => Promise<void>;
  rejectAccount: (user: User) => Promise<void>;
};

const UnapprovedAccount: React.FC<UnapprovedAccountProps> = ({
  user,
  index,
  approveAccount,
  rejectAccount,
}) => {
  const [yesLoading, setYesLoading] = useState(false);
  const [noLoading, setNoLoading] = useState(false);

  const onYesClick = async (): Promise<void> => {
    setYesLoading(true);
    await approveAccount(user);
    setYesLoading(false);
  };

  const onNoClick = async (): Promise<void> => {
    setNoLoading(true);
    await rejectAccount(user);
    setNoLoading(false);
  };

  // const client = useContext(APIContext);

  // <LoadingButton
  //     loading={loading}
  //     size="large"
  //     variant="contained"
  //     onClick={() => onLogin()}
  // >
  //     Login
  // </LoadingButton>

  // if (index % 2 == 0) {
  return (
    <div className={index % 2 == 0 ? styles.accountBarGrey : styles.accountBarWhite}>
      <Link href={`/profile/${user.id}`}>
        <a className={styles.linkRow}>{user.firstName + " " + user.lastName} </a>
      </Link>
      <p className={styles.rows}>{user.email}</p>
      <p className={styles.rows}>{user.dateCreated}</p>
      <p className={styles.rows}>{user.role}</p>
      <div>
        <LoadingButton
          loading={yesLoading}
          size={"small"}
          variant={"contained"}
          onClick={onYesClick}
        >
          Yes
        </LoadingButton>
        {/*<button className={styles.approveBtn} onClick={() => approveAccount(user)}>*/}
        {/*  Yes*/}
        {/*</button>*/} /{" "}
        <LoadingButton loading={noLoading} size={"small"} variant={"contained"} onClick={onNoClick}>
          No
        </LoadingButton>
        {/*<button className={styles.rejectBtn} onClick={() => rejectAccount(user)}>*/}
        {/*  No*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export { UnapprovedAccount };
