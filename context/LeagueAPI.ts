import axios, { AxiosInstance } from "axios";
import { Class, CreateClass } from "../models/class";
import { ClassEvent, CreateClassEvent } from "../models/events";
import { Staff } from "../models/staff";
import { CreateUser, UpdateUser, User } from "../models/users";
import { Image, UpdateImage } from "../models/images";
import { Availability } from "../models/availability";

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

  // get all classes from the backend
  async getAllClasses(): Promise<Class[]> {
    const res = await this.client.get("api/class");
    return res.data;
  }

  // create an even of type class
  async createClassEvent(classEvent: CreateClassEvent): Promise<ClassEvent> {
    const res = await this.client.post("api/events/class", classEvent);
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
}

export { LeagueAPI };
