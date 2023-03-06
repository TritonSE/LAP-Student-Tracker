import axios, { AxiosInstance } from "axios";
import {
  Announcement,
  Attendance,
  Availability,
  Class,
  ClassEvent,
  CreateAnnouncement,
  CreateAttendance,
  CreateClass,
  CreateClassEvent,
  CreateOneOffEvent,
  CreateParentStudentLink,
  CreateUser,
  Image,
  Item,
  MissingAttendance,
  Module,
  OneOffEvent,
  ParentStudentLink,
  SessionInformation,
  SingleUserAttendance,
  Staff,
  Student,
  UpdateImage,
  UpdateUser,
  User,
} from "../models";

// LeagueAPI class to connect front and backend
class LeagueAPI {
  client: AxiosInstance;
  token?: string;
  getNewRefreshToken?: () => Promise<string | null>;

  // Create the class
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // intercept all responses that return a 401 and supply the correct authentication header
    // only retry once
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const HEADER_NAME = "Authorization";
        const originalRequestConfig = error.config;
        if (error.response) {
          if (error.response.status == 401 && !originalRequestConfig._retry) {
            const newTokenCreated = await this.refreshToken();
            if (!newTokenCreated) return Promise.reject(error);
            this.token = newTokenCreated;
            originalRequestConfig._retry = true;
            delete originalRequestConfig.headers[HEADER_NAME];
            originalRequestConfig.headers[HEADER_NAME] = `Bearer ${this.token}`;
            return this.client.request(originalRequestConfig);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  setRefreshTokenFunction(func: () => Promise<string | null>): void {
    this.getNewRefreshToken = func;
  }

  // refresh API token so that we don't run into 401 errors
  async refreshToken(): Promise<string | null> {
    if (!this.getNewRefreshToken) return null;
    return this.getNewRefreshToken();
  }

  // Get the staff from the backend
  async getStaff(): Promise<Staff[]> {
    const res = await this.client.get("api/staff");
    return res.data;
  }

  async getAvailabilities(id: string): Promise<Availability> {
    const res = await this.client.get(`api/availability/${id}`);
    return res.data;
  }

  async getClass(id: string): Promise<Class> {
    const res = await this.client.get(`api/class/${id}`);
    return res.data;
  }

  async getAllClasses(userId?: string): Promise<Class[]> {
    const res = await this.client.get("api/class", { params: { userId: userId } });
    return res.data;
  }
  async deleteClassEvent(userId: string): Promise<Class> {
    const res = await this.client.delete(`api/events/class/${userId}`);
    return res.data;
  }
  // create an even of type class
  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("api/events/class", classEvent);
    return res.data;
  }

  async createOneOffEvent(oneOffEvent: CreateOneOffEvent): Promise<OneOffEvent> {
    const res = await this.client.post("api/events/event", oneOffEvent);
    return res.data;
  }

  // create a class entry
  async createClass(classObj: CreateClass): Promise<Class> {
    const res = await this.client.post("api/class", classObj);
    return res.data;
  }

  // get a user
  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`);
    return res.data;
  }

  async getAllUsers(role?: string, approved?: boolean | undefined): Promise<User[]> {
    const res = await this.client.get("/api/users/", {
      params: { role: role, approved: approved },
    });
    return res.data;
  }
  // get an image (img is a b64 string)
  async getImage(id: string): Promise<Image> {
    await this.refreshToken();
    const res = await this.client.get(`api/images/${id}`);
    return res.data;
  }

  // update an image (img should be a b64 string)
  async updateImage(id: string, updatedImage: UpdateImage): Promise<Image> {
    const res = await this.client.patch(`api/images/${id}`, updatedImage);
    return res.data;
  }

  async createUser(user: CreateUser): Promise<User> {
    const res = await this.client.post("api/users/", user);
    return res.data;
  }

  // update a user
  async updateUser(user: UpdateUser, id: string): Promise<User> {
    const res = await this.client.patch(`api/users/${id}`, user);
    return res.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`api/users/${id}`);
  }

  async updateAvailabilities(availabilities: Availability, id: string): Promise<Availability> {
    const res = await this.client.patch(`api/availability/${id}`, availabilities);
    return res.data;
  }

  async getRoster(classId: string): Promise<User[]> {
    const res = await this.client.get(`api/class/${classId}/roster`);
    return res.data;
  }

  async getClassModules(classId: string): Promise<Module[]> {
    const res = await this.client.get(`api/class/${classId}/modules`);
    return res.data;
  }

  async getAnnouncements(classId: string): Promise<Announcement[]> {
    const res = await this.client.get(`api/class/${classId}/announcement`);
    return res.data;
  }

  async createAnnouncement(
    classId: string,
    announcement: CreateAnnouncement
  ): Promise<Announcement> {
    const res = await this.client.post(`api/class/${classId}/announcement`, announcement);
    return res.data;
  }

  async deleteAnnouncement(classId: string, announcement_id: string): Promise<Announcement> {
    const res = await this.client.delete(`api/class/${classId}/announcement/${announcement_id}`);
    return res.data;
  }

  // Get the students from the backend
  async getStudents(): Promise<Student[]> {
    const res = await this.client.get("api/students");
    return res.data;
  }

  async createModule(module: Module): Promise<Module> {
    const res = await this.client.post("api/module/", module);
    return res.data;
  }

  async updateModule(moduleId: string, module: Module): Promise<Module> {
    const res = await this.client.patch(`api/module/${moduleId}`, module);
    return res.data;
  }
  async deleteModule(moduleId: string): Promise<void> {
    const res = await this.client.delete(`api/module/${moduleId}`);
    return res.data;
  }

  async createItem(moduleId: string, item: Item): Promise<Item> {
    const res = await this.client.post(`api/module/${moduleId}/item`, item);
    return res.data;
  }

  async getModuleItems(moduleId: string): Promise<Item[]> {
    const res = await this.client.get(`api/module/${moduleId}/item`);
    return res.data;
  }

  async updateItem(moduleId: string, itemId: string, item: Item): Promise<Item> {
    const res = await this.client.patch(`/api/module/${moduleId}/item/${itemId}`, item);
    return res.data;
  }

  async deleteItem(moduleId: string, itemId: string): Promise<void> {
    await this.client.delete(`api/module/${moduleId}/item/${itemId}`);
  }

  async getSessions(classId: string, time?: string): Promise<SessionInformation[]> {
    const res = await this.client.get(`api/class/${classId}/sessions?date=${time}`);
    return res.data;
  }

  async getAttendanceFromSessionID(session: string, classId: string): Promise<Attendance[]> {
    const res = await this.client.get(`api/class/${classId}/attendance/${session}`);
    return res.data;
  }

  async getSingleUserAttendanceFromSessionID(
    userId: string,
    session: string,
    classId: string
  ): Promise<SingleUserAttendance[]> {
    const res = await this.client.get(`api/users/${userId}/attendance/${classId}/${session}`);
    return res.data;
  }

  async createAttendance(
    session: string,
    classId: string,
    attendanceArray: CreateAttendance[]
  ): Promise<Attendance[]> {
    const res = await this.client.post(
      `api/class/${classId}/attendance/${session}`,
      attendanceArray
    );
    return res.data;
  }
  async createCommitment(classId: string, studentId: string): Promise<void> {
    await this.client.post(`api/class/${classId}/student`, {
      studentId: studentId,
    });
  }

  async deleteCommitment(classId: string, studentId: string): Promise<void> {
    await this.client.delete(`api/class/${classId}/student/${studentId}`);
  }

  async createParentStudentLink(
    parentId: string,
    createParentStudentLink: CreateParentStudentLink
  ): Promise<ParentStudentLink> {
    const res = await this.client.post(`api/parents/${parentId}/student`, createParentStudentLink);
    return res.data;
  }

  async getStudentsLinkedToParent(parentId: string): Promise<User[]> {
    const res = await this.client.get(`api/parents/${parentId}/student`);
    return res.data;
  }

  async getMissingAttednance(classId: string): Promise<MissingAttendance[]> {
    const res = await this.client.get(`api/class/${classId}/missing_attendance`);
    return res.data;
  }
}

export { LeagueAPI };
