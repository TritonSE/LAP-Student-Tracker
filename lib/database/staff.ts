import { client } from "../db";
import { Staff } from "../../models";
import { array, TypeOf } from "io-ts";
import { decode } from "io-ts-promise";

const StaffArraySchema = array(Staff);
type staffArray = TypeOf<typeof StaffArraySchema>;

const getAllStaff = async (): Promise<Staff[]> => {
  // query returns one object for each class a teacher is taking (with the classes respective min and max levels) and
  // all admins with null for min and max level.
  const query = {
    text:
      "SELECT users.id, users.first_name, users.last_name, users.email, users.role, users.approved, users.date_created," +
      "users.phone_number, users.address, users.picture_id, classes.min_level, classes.max_level, classes.language " +
      "FROM (((event_information INNER JOIN classes ON event_information.id = classes.event_information_id) " +
      "INNER JOIN commitments ON commitments.event_information_id = event_information.id) " +
      "FULL OUTER JOIN users ON commitments.user_id = users.id) WHERE role = 'Teacher' OR role = 'Staff' OR role = 'Admin';",
  };

  const res = await client.query(query);
  let staffArrayWithDuplicates: staffArray;
  try {
    staffArrayWithDuplicates = await decode(StaffArraySchema, res.rows);
  } catch (e) {
    throw Error("Fields returned incorrectly from database");
  }

  // map from id to staff objects
  const idToObject = new Map<string, Staff>();

  // logic to combine min and max levels for all the teacher objects that were returned
  staffArrayWithDuplicates.forEach((staff) => {
    // if an object is not in the map or the object is of type admin, then insert into the map
    if (!idToObject.has(staff.id) || staff.role == "Admin") {
      idToObject.set(staff.id, staff);
    } else {
      // staff is guaranteed to exist and will not be of role Admin
      const staffAlreadyAdded = idToObject.get(staff.id) as Staff;

      // if current staff object min level is null, keep the old staff objects min level. If the current staff minLevel is not null but
      // the old staff object is null, then keep the current staff's min level. If both are not null, then return the minimum of both
      staffAlreadyAdded.minLevel =
        staff.minLevel != null && staffAlreadyAdded.minLevel != null
          ? Math.min(staff.minLevel, staffAlreadyAdded.minLevel)
          : staff.minLevel == null
          ? staffAlreadyAdded.minLevel
          : staff.minLevel;
      // logic same as above, but using max instead of min
      staffAlreadyAdded.maxLevel =
        staff.maxLevel != null && staffAlreadyAdded.maxLevel != null
          ? Math.max(staff.maxLevel, staffAlreadyAdded.maxLevel)
          : staff.minLevel == null
          ? staffAlreadyAdded.minLevel
          : staff.minLevel;
      idToObject.set(staffAlreadyAdded.id, staffAlreadyAdded);
    }
  });

  return Array.from(idToObject.values());
};

export { getAllStaff };
