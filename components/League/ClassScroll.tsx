import React, { useContext } from "react";
import { APIContext } from "../../context/APIContext";
import useSWR from "swr";
import { CustomError } from "../util/CustomError";
import { CustomLoader } from "../util/CustomLoader";
import { Class } from "../../models";
import { Empty } from "../util/Empty";
import { ClassCard } from "./ClassCard";
import { OrderBy } from "./ClassView";

type ClassScrollProp = {
  searchQuery: string;
  orderBy: OrderBy;
  selectedLevels: Set<number>;
};

// Renders the filtered list of classes
export const ClassScroll: React.FC<ClassScrollProp> = ({
  searchQuery,
  orderBy,
  selectedLevels,
}) => {
  const client = useContext(APIContext);
  const { data: classes, error } = useSWR("/api/class", () => client.getAllClasses());

  if (error) return <CustomError />;
  if (!classes) return <CustomLoader />;

  const checkIfLevelSelected = (selectedLevels: Set<number>, tempClass: Class): boolean => {
    if (selectedLevels.size === 0) {
      return true;
    }

    let selected = false;

    // construct array of numbers from minLevel to maxLevel (inclusive) and check if one of these levels is a
    // level the user wants
    Array(tempClass.maxLevel - tempClass.minLevel + 1)
      .fill(0)
      .map((_, i) => i)
      .map((val) => val + tempClass.minLevel)
      .forEach((level) => {
        if (selectedLevels.has(level)) selected = true;
      });

    return selected;
  };

  // Sort classes either alphabetically or by level
  const sortBy = (a: Class, b: Class): number => {
    // Sort alphabetically
    if (orderBy.alpha) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    }
    // Sort by level
    else if (orderBy.level) {
      if (a.minLevel < b.minLevel) {
        return -1;
      }
      if (a.minLevel > b.minLevel) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  };

  const filteredClasses = classes
    .filter(
      (currClass) =>
        currClass.name.includes(searchQuery) && checkIfLevelSelected(selectedLevels, currClass)
    )
    .sort((a, b) => {
      return sortBy(a, b);
    });

  if (classes.length == 0) return <Empty userType="Classes" />;

  return (
    <div>
      {filteredClasses.map((currClass: Class) => (
        <ClassCard
          key={currClass.eventInformationId}
          id={currClass.eventInformationId}
          name={currClass.name}
          minLevel={currClass.minLevel}
          maxLevel={currClass.maxLevel}
          rrstring={currClass.rrstring}
          startTime={currClass.startTime}
          endTime={currClass.endTime}
        />
      ))}
    </div>
  );
};
