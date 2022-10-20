import { client } from "../db";
import { Student } from "../../models";
import { Roles } from "../../models";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";
import * as t from "io-ts";

const StudentInClassSchema = t.type({
  id: t.string,
  firstName: t.string,
  lastName: t.string,
  email: t.string,
  role: Roles,
  pictureId: t.string,
  approved: t.boolean,
  dateCreated: t.string,
  phoneNumber: t.union([t.string, t.null]),
  address: t.union([t.string, t.null]),
  level: t.union([t.number, t.null]),
  class: t.union([t.string, t.null]),
});

const StudentInClassArraySchema = array(StudentInClassSchema);
type studentArray = TypeOf<typeof StudentInClassArraySchema>;

const getAllStudents = async (): Promise<Student[]> => {
  // query returns one object for each class a student is taking (with the classes respective name and id)
  const query = {
    text:
      "SELECT users.id, users.first_name, users.last_name, users.email, users.role, users.picture_id," +
      "users.approved, users.date_created, users.phone_number, users.address, classes.max_level AS level," +
      "event_information.name AS class " +
      "FROM (((event_information INNER JOIN classes ON event_information.id = classes.event_information_id) " +
      "INNER JOIN commitments ON commitments.event_information_id = event_information.id) " +
      "FULL OUTER JOIN users ON commitments.user_id = users.id) WHERE role = 'Student'",
  };

  const res = await client.query(query);
  let studentArrayWithDuplicates: studentArray;
  try {
    studentArrayWithDuplicates = await decode(StudentInClassArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly from database");
  }

  // map from id to student objects
  const idToObject = new Map<string, Student>();

  // logic to assign the max level to the student for all the student objects that were returned
  studentArrayWithDuplicates.forEach((studentInClass) => {
    // if an object is not in the map, then insert into the map
    if (!idToObject.has(studentInClass.id)) {
      const student: Student = {
        id: studentInClass.id,
        firstName: studentInClass.firstName,
        lastName: studentInClass.lastName,
        email: studentInClass.email,
        role: studentInClass.role,
        pictureId: studentInClass.pictureId,
        approved: studentInClass.approved,
        dateCreated: studentInClass.dateCreated,
        phoneNumber: studentInClass.phoneNumber,
        address: studentInClass.address,
        level: studentInClass.level,
        classes: studentInClass.class ? [studentInClass.class] : [],
      };
      idToObject.set(studentInClass.id, student);
    } else {
      const studentAlreadyAdded = idToObject.get(studentInClass.id) as Student;

      // add current student object class to old student's array of classes
      if (studentInClass.class) studentAlreadyAdded.classes.push(studentInClass.class);

      // if current student object level is null, keep the old student objects level. If the current student level is not null but
      // the old student object is null, then keep the current student's level. If both are not null, then return the maximum of both
      studentAlreadyAdded.level =
        studentInClass.level != null && studentInClass.level != null
          ? Math.max(studentInClass.level, studentAlreadyAdded.level)
          : studentInClass.level == null
          ? studentAlreadyAdded.level
          : studentInClass.level;
      idToObject.set(studentAlreadyAdded.id, studentAlreadyAdded);
    }
  });

  return Array.from(idToObject.values());
};

export { getAllStudents };
