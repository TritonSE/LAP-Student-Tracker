import axios, { AxiosInstance } from "axios";
import { User } from "../models/users";
import { CreateClass, Class } from "../models/class";
import { CreateClassEvent, ClassEvent } from "../models/events";

// LeagueAPI class to connect front and backend
class LeagueAPI {
  client: AxiosInstance;
  token?: string;

  // Create the class
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Get the staff from the backend
  async getStaff(): Promise<User[]> {
    const res = await this.client.get("api/staff");
    return res.data;
  }

<<<<<<< HEAD
  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("api/events/class", classEvent);
    return res.data;
  }

  async createClass(classObj: CreateClass): Promise<Class> {
    const res = await this.client.post("api/class", classObj);
=======
  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`);
    return res.data;
  }

  async createUser(user: User): Promise<User> {
    const res = await this.client.post("api/users/", user);
>>>>>>> origin/master
    return res.data;
  }
}

export { LeagueAPI };
