import axios, { AxiosInstance } from "axios";
import { User } from "../models/users";
import { Class } from "../models/class";

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

  async getClass(id: string): Promise<Class> {
    const res = await this.client.get(`api/class/${id}`);
    return res.data;
  }
  async getAllClasses(): Promise<Class[]> {
    const res = await this.client.get("api/class");
    return res.data;
  }

  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`);
    return res.data;
  }

  async createUser(user: User): Promise<User> {
    const res = await this.client.post("api/users/", user);
    return res.data;
  }
}

export { LeagueAPI };
