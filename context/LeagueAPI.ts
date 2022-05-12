import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import { Class, CreateClass } from "../models/class";
import { ClassEvent, CreateClassEvent } from "../models/events";
import { UpdateUser, User } from "../models/users";
import {Image, UpdateImage} from "../models/images";

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

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("api/events/class", classEvent);
    return res.data;
  }

  async createClass(classObj: CreateClass): Promise<Class> {
    const res = await this.client.post("api/class", classObj);
    return res.data;
  }

  async getUser(id: string): Promise<User> {
    const res = await this.client.get(`api/users/${id}`);
    return res.data;
  }

  async getImage(id: string): Promise<Uint8Array | null> {
    const res = await this.client.get(`api/images/${id}`, {responseType: "blob"});
    return res.data;
  }

  async updateImage(id: string, updatedImage: UpdateImage): Promise<Image> {
    const headers = {
      'Content-Type': "arraybuffer",
      'Authorization': `Bearer ${this.token}`
    };
    const requestConifg: AxiosRequestConfig = {
      headers: headers
    };

    console.log("LENGTH OF UPDATED IMAGE: " + updatedImage.img.length)
   const res = await this.client.patch(`api/images/${id}`, updatedImage.img, requestConifg
   );
   return res.data;
  }

  async getAllUsers(role?: string): Promise<User[]> {
    const res = await this.client.get("/api/users/", { params: { role: role } });
    return res.data;
  }

  async createUser(user: User): Promise<User> {
    const res = await this.client.post("api/users/", user);
    return res.data;
  }

  async updateUser(user: UpdateUser, id: string): Promise<User> {
    const res = await this.client.patch(`api/users/${id}`, user);
    return res.data;
  }
}

export { LeagueAPI };
