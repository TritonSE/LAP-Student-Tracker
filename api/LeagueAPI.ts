import axios, { AxiosInstance } from "axios";
import { User } from "../models/users";
import { CreateClass, Class } from "../models/classes";
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

  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("event/class", {
      classEvent
    });
    return res.data;
  }

  async createClass(id: string, classSchema: CreateClass): Promise<Class> {
    const res = await this.client.post(`class/${id}`, {
      classSchema
    });
    return res.data;
  }
}

export { LeagueAPI };
