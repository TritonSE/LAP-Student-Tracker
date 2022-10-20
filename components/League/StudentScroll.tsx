import React, { useContext } from "react";
import { APIContext } from "../../context/APIContext";
import useSWR from "swr";
import { CustomError } from "../util/CustomError";
import { CustomLoader } from "../util/CustomLoader";
import { Student } from "../../models";
import { Empty } from "../util/Empty";
import { StudentCard } from "./StudentCard";
import { OrderBy } from "./StudentView";

type StudentScrollProp = {
  searchQuery: string;
  orderBy: OrderBy;
  selectedLevels: Set<number>;
};

// Renders the filtered list of students
export const StudentScroll: React.FC<StudentScrollProp> = ({
  searchQuery,
  orderBy,
  selectedLevels,
}) => {
  const client = useContext(APIContext);
  const { data: students, error } = useSWR("/api/students", () => client.getStudents());

  if (error) return <CustomError />;
  if (!students) return <CustomLoader />;

  const checkIfLevelSelected = (selectedLevels: Set<number>, student: Student): boolean => {
    if (selectedLevels.size === 0) {
      return true;
    }

    let selected = false;
    // if a level filter is selected, but students's level is null, return false
    if (!student.level && selectedLevels.size > 0) {
      selected = false;
    }

    selectedLevels.forEach((level) => {
      if (student.level !== null && level === student.level) {
        selected = true;
      }
    });

    return selected;
  };

  // Sort classes either alphabetically or by level
  const sortBy = (a: Student, b: Student): number => {
    // Sort alphabetically
    if (orderBy.alpha) {
      if (a.lastName < b.lastName) {
        return -1;
      } else if (a.lastName > b.lastName) {
        return 1;
      } else {
        if (a.firstName < b.firstName) {
          return -1;
        } else if (a.firstName > b.firstName) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    // Sort by level, ties in level are settled using account creation date
    else if (orderBy.level) {
      if (a.level && b.level) {
        if (a.level < b.level) {
          return -1;
        } else if (a.level > b.level) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (b.level) {
          return -1;
        } else if (a.level) {
          return 1;
        } else {
          return 0;
        }
      }
    }
    return 0;
  };

  const filteredStudents = students
    .filter(
      (currStudent) =>
        (currStudent.firstName.includes(searchQuery) ||
          currStudent.lastName.includes(searchQuery)) &&
        checkIfLevelSelected(selectedLevels, currStudent)
    )
    .sort((a, b) => {
      return sortBy(a, b);
    });

  if (students.length == 0) return <Empty userType="Students" />;

  return (
    <>
      {filteredStudents.map((currStudent) => (
        <StudentCard
          key={currStudent.id}
          firstName={currStudent.firstName}
          lastName={currStudent.lastName}
          level={currStudent.level}
          classes={currStudent.classes}
        />
      ))}
    </>
  );
};
