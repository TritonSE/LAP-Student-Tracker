import React, { useContext } from "react";
import StaffCard from "./StaffCard";
import { APIContext } from "../context/APIContext";
import Loader from "./Loader";
import Error from "./Error";
import Empty from "./Empty";
import useSWR from "swr";

const StaffScroll: React.FC = () => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/staff", () => client.getStaff());

  if (error) return <Error />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty />;

  return (
    <>
      {data.map((c: any) => (
        <StaffCard
          key={c.id}
          firstName={c.firstName}
          lastName={c.lastName}
          phone_number={c.phoneNumber}
          email={c.email}
        />
      ))}
    </>
  );
};

export default StaffScroll;
