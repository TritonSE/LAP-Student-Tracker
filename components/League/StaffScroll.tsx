import React, { useContext } from "react";
import { StaffCard } from "./StaffCard";
import { APIContext } from "../../context/APIContext";
import { Loader } from "../util/Loader";
import { CustomError } from "../util/CustomError";
import { Empty } from "../util/Empty";
import { Staff } from "../../models/staff";
import useSWR from "swr";

type StaffScrollProp = {
  searchQuery: string;
  selectedFilters: string[];
};

// Renders the list of staff or the corresponding error
const StaffScroll: React.FC<StaffScrollProp> = ({ searchQuery, selectedFilters }) => {
  const client = useContext(APIContext);

  // Use SWR hook to get the data from the backend
  const { data, error } = useSWR("/api/staff", () => client.getStaff());

  if (error) return <CustomError />;
  if (!data) return <Loader />;
  if (data.length == 0) return <Empty userType="Staff" />;

  const checkIfFilterSelected = (selectedFilter: string[], staff: Staff): boolean => {
    if (selectedFilter.length === 0) {
      return true;
    }

    //separates the roles filter from the levels filter (by checking for digit)
    const roleFilters: string[] = [];
    const levelFilters: string[] = [];
    selectedFilter.forEach((filter) => {
      if (/\d/.test(filter)) {
        levelFilters.push(filter);
      } else {
        roleFilters.push(filter);
      }
    });

    let selected = false;
    roleFilters.forEach((role) => {
      if (role.toLowerCase().includes(staff.role.toLowerCase())) {
        selected = true;
      }
    });

    // if a level filter is selected, but staff's min/max level is null, return false
    if ((!staff.maxLevel || !staff.minLevel) && levelFilters.length > 0) {
      selected = false;
    }

    levelFilters.forEach((level) => {
      // replaces all not-digits with nothing, so result is just number
      const levelNum = parseInt(level.replace(/^\D+/g, ""));
      if (
        staff.maxLevel !== null &&
        levelNum <= staff.maxLevel &&
        staff.minLevel !== null &&
        levelNum >= staff.minLevel
      ) {
        selected = true;
      }
    });

    return selected;
  };

  const filteredStaff = data.filter((currStaff) => {
    return (
      (currStaff.firstName + " " + currStaff.lastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) && checkIfFilterSelected(selectedFilters, currStaff)
    );
  });

  return (
    <>
      {filteredStaff.map((currStaff) => (
        <StaffCard
          key={currStaff.id}
          firstName={currStaff.firstName}
          lastName={currStaff.lastName}
          phone_number={currStaff.phoneNumber}
          email={currStaff.email}
        />
      ))}
    </>
  );
};

export { StaffScroll };
